# Yarn Twist Visualizer

An interactive web-based tool for visualizing yarn twist in textile engineering. Simulate S-twist and Z-twist configurations, adjust TPI (Twists Per Inch), yarn count, and color in real-time.

## Features

- Real-time yarn twist visualization
- Adjustable TPI (Twists Per Inch) from 1 to 30
- Yarn count (Ne) control from 1 to 40
- S-Twist and Z-Twist direction options
- Customizable yarn color picker
- Zoom and pan functionality with mouse controls
- Export visualization as PNG image
- Multiple fiber strand visualization
- Responsive design for all devices

## Technologies Used

- HTML5
- CSS3
- JavaScript
- SVG (Scalable Vector Graphics)

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/reyrove/yarn-twist-visualizer.git
   ```

2. Navigate to the project folder
   ```bash
   cd yarn-twist-visualizer
   ```

3. Open `index.html` in your browser

## File Structure

```
yarn-twist-visualizer/
├── index.html
├── style.css
├── script.js
├── README.md
├── LICENSE
└── .gitignore
```

## Controls

| Control | Function |
|---------|----------|
| TPI Slider | Adjust twists per inch (1-30) |
| Yarn Count Slider | Adjust Ne yarn count (1-40) |
| Twist Direction | Switch between S-Twist and Z-Twist |
| Yarn Color | Pick custom color for visualization |
| Export to PNG | Save current visualization as image |

## Interaction Features

- **Zoom** - Scroll wheel to zoom in/out (0.5x to 3x)
- **Pan** - Click and drag to move the visualization
- **Real-time updates** - All changes update instantly

## Understanding Twist

- **S-Twist** - Fibers twisted in a leftward direction (like the middle of the letter S)
- **Z-Twist** - Fibers twisted in a rightward direction (like the middle of the letter Z)

## TPI (Twists Per Inch)

TPI indicates the number of twists in one inch of yarn. Higher TPI creates:
- Stronger yarn
- More compact structure
- Different texture and feel

## Yarn Count (Ne)

The English cotton count system where higher numbers indicate finer yarn.

## Usage

1. Open the application in any modern web browser
2. Adjust TPI slider to see twist density changes
3. Change yarn count to see fiber thickness variation
4. Switch between S and Z twist directions
5. Pick any color for the yarn
6. Use scroll wheel to zoom for detailed inspection
7. Click and drag to pan across the visualization
8. Click Export to PNG to save your visualization

## Browser Support

- Google Chrome
- Mozilla Firefox
- Safari
- Microsoft Edge

## Customization

You can modify in `script.js`:
- `numFibers` - Number of fiber strands displayed
- `radius` calculation - Yarn thickness formula
- Zoom limits (minimum and maximum scale)
- Animation settings

## License

MIT License - see the LICENSE file for details

## Author

Created by Reyrove