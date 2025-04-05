# Modus

**Modus** is a personalized fitness and wellness app designed to provide tailored insights based on your body stats, activity levels, and fitness goals. Using advanced calculations for energy expenditure, macronutrient needs, heart rate zones, and muscular potential, Modus helps you optimize your daily schedule, nutrition, and training regimen—all while keeping your data local in your browser.

## Features

- **Personalized Daily Schedule**: Dynamically generated based on your circadian rhythm, sunrise/sunset times, and activity goals.
- **Nutrition Planning**: Calculates Total Daily Energy Expenditure (TDEE), macronutrient breakdowns (protein, fats, carbs), and water intake tailored to your goals (e.g., hypertrophy, endurance, strength).
- **Heart Rate Zones**: Custom zones based on your resting and max heart rate for effective cardio training.
- **Muscular Potential**: Estimates your maximum lean muscle mass at various body fat percentages.
- **Kinesiology Insights**: Detailed muscle fiber type data and training recommendations for optimizing performance.
- **Privacy First**: All data is stored locally in your browser—no server uploads, no tracking. Clear your browser data, and it’s gone!

## Tech Stack

- **Frontend**: Svelte for reactive UI components.
- **State Management**: LocalStorage for persistent, client-side data.
- **Calculations**: JavaScript functions for BMR, TDEE, macros, HR zones, and more.
- **Styling**: Custom CSS with responsive grid and flexbox layouts.

## Live Preview

See it live at [MODUS](https://minotaurengineer.github.io/modus/)

## Usage

1. **Set Up Your Profile**: On first load, click the "Start using Modus" link to input your stats (age, weight, height, body fat, activity level, etc.).
2. **View Insights**: Once your data is entered, Modus will generate:
   - A daily schedule with meal and workout times.
   - Nutrition recommendations (calories, macros, water).
   - Performance metrics (HR zones, VO2 max, muscular potential).
3. **Adjust Goals**: Update your activity goal (e.g., Hypertrophy, Strength, Endurance) to recalculate macros and energy needs.

Your data stays in your browser’s LocalStorage. To reset, clear your browser cache.

## Project Structure

- **`src/state/viewData.js`**: Core logic for processing user data and generating view states.
- **`src/*.svelte`**: UI components for schedule, nutrition, performance, and more.
- **Data Files**: JSON structures for activity levels, muscle groups, and fiber types.
- **`src/state/*.js`**: Utility functions for BMR, TDEE, macros, and HR calculations.

## Contributing

Contributions are welcome! To get started:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to your branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

Please ensure your code follows the existing style and includes tests where applicable.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

Built with ❤️ by MinotaurEngineer.