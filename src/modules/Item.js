// Meal class
class Meal {
	constructor(name, calories) {
		this.id = Math.random().toString(16).slice(2);
		this.name = name;
		this.calories = calories;
	}
}

// Workout class
class Workout {
	constructor(name, caloriesBurned) {
		this.id = Math.random().toString(16).slice(2);
		this.name = name;
		this.caloriesBurned = caloriesBurned;
	}
}

export { Meal, Workout };
