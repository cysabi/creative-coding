package main

import (
	"fmt"
	"math"
	"math/rand"
	"os"
	"time"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/harmonica"
	"golang.org/x/exp/slices"
)

const (
	fps    = 60
	spread = 5
)

var ascii = []string{"!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?", "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^", "_", "`", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "{", "|", "}", "~"}
var emoji = []string{"☀️", "☔", "☁️", "❄️", "⛄", "⚡", "🌀", "🌁", "🌊", "🐱", "🐶", "🐭", "🐹", "🐰", "🐺", "🐸", "🐯", "🐨", "🐻", "🐷", "🐽", "🐮", "🐗", "🐵", "🐒", "🐴", "🐎", "🐫", "🐑", "🐘", "🐼", "🐍", "🐦", "🐤", "🐥", "🐣", "🐔", "🐧", "🐢", "🐛", "🐝", "🐜", "🪲", "🐌", "🐙", "🐠", "🐟", "🐳", "🐋", "🐬", "🐄", "🐏", "🐀", "🐃", "🐅", "🐇", "🐉", "🐐", "🐓", "🐕", "🐖", "🐁", "🐂", "🐲", "🐡", "🐊", "🐪", "🐆", "🐈", "🐩", "🐾", "💐", "🌸", "🌷", "🍀", "🌹", "🌻", "🌺", "🍁", "🍃", "🍂", "🌿", "🍄", "🌵", "🌴", "🌲", "🌳", "🌰", "🌱", "🌼", "🌾", "🐚", "🌐", "🌞", "🌝", "🌚", "🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘", "🌜", "🌛", "🌔", "🌍", "🌎", "🌏", "🌋", "🌌", "⛅"}

type frameMsg time.Time

func animate() tea.Cmd {
	return tea.Tick(time.Second/fps, func(t time.Time) tea.Msg {
		return frameMsg(t)
	})
}

type model struct {
	cells       cellbuffer
	projectiles []*harmonica.Projectile
}

func (m model) Init() tea.Cmd {
	return tea.Sequence(tea.ClearScreen, animate())
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {

	case tea.KeyMsg:
		return m, tea.Quit

	case tea.WindowSizeMsg:
		m.cells.init(msg.Width, msg.Height)
		return m, nil

	case tea.MouseMsg:
		if !m.cells.ready() {
			return m, nil
		}
		angle := rand.Float64() * 2 * math.Pi
		newProjectile := harmonica.NewProjectile(harmonica.FPS(fps),
			harmonica.Point{X: float64(msg.X), Y: float64(msg.Y)},
			harmonica.Vector{X: math.Cos(angle), Y: math.Sin(angle)},
			harmonica.TerminalGravity,
		)
		m.projectiles = append(m.projectiles, newProjectile)
		return m, nil

	case frameMsg:
		if !m.cells.ready() {
			return m, nil
		}

		for _, p := range m.projectiles {
			m.cells.set(int(p.Position().X), int(p.Position().Y), " ")
		}
		for _, p := range m.projectiles {
			p.Update()
		}
		for _, p := range m.projectiles {
			x, y := int(p.Position().X), int(p.Position().Y)
			c := m.cells.get(x, y)
			if slices.Contains(ascii, c) {
				m.cells.set(x, y, emoji[rand.Intn(len(emoji))])
			} else {
				m.cells.set(x, y, ascii[rand.Intn(len(ascii))])
			}
		}

		return m, animate()

	default:
		return m, nil
	}
}

func (m model) View() string {
	return m.cells.String()
}

func main() {
	m := model{}

	p := tea.NewProgram(m, tea.WithAltScreen(), tea.WithMouseCellMotion())
	if _, err := p.Run(); err != nil {
		fmt.Println("Uh oh:", err)
		os.Exit(1)
	}
}
