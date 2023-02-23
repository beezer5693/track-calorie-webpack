import Storage from './Storage';

// Calorie tracker class
class CalorieTracker {
	constructor() {
		this._calorieLimit = Storage.getCalorieLimit();
		this._totalCalories = Storage.getTotalCalories();
		this._meals = Storage.getMeals();
		this._workouts = Storage.getWorkouts();

		this._render();
		document.getElementById('limit').value = this._calorieLimit;
	}

	// Public Methods/API

	addMeal(meal) {
		this._meals.push(meal);
		this._totalCalories += meal.calories;
		this._displayNewMeal(meal);
		Storage.updateTotalCalories(this._totalCalories);
		Storage.saveMeal(meal);
		this._render();
	}

	addWorkout(workout) {
		this._workouts.push(workout);
		this._totalCalories -= workout.caloriesBurned;
		this._displayNewWorkout(workout);
		Storage.updateTotalCalories(this._totalCalories);
		Storage.saveWorkout(workout);
		this._render();
	}

	removeMeal(id) {
		const [deletedMeal] = this._meals.filter(meal => meal.id === id);
		this._totalCalories -= deletedMeal.calories;
		Storage.removeMeal(id);
		Storage.updateTotalCalories(this._totalCalories);
		this._meals.splice(this._meals.indexOf(deletedMeal), 1);
		this._render();
	}

	removeWorkout(id) {
		const [deletedWorkout] = this._workouts.filter(workout => workout.id === id);
		this._totalCalories += deletedWorkout.caloriesBurned;
		Storage.updateTotalCalories(this._totalCalories);
		Storage.removeWorkout(id);
		this._workouts.splice(this._workouts.indexOf(deletedWorkout), 1);
		this._render();
	}

	reset() {
		this._totalCalories = 0;
		this._meals = [];
		this._workouts = [];
		Storage.clearAll();
		this._render();
	}

	setLimit(newCalorieLimit) {
		this._calorieLimit = newCalorieLimit;
		Storage.setCalorieLimit(newCalorieLimit);
		this._render();
	}

	loadItems() {
		this._meals.forEach(meal => this._displayNewMeal(meal));
		this._workouts.forEach(workout => this._displayNewWorkout(workout));
	}

	// Private Methods/API

	_displayCaloriesTotal() {
		const totalCaloriesEl = document.getElementById('calories-total');
		totalCaloriesEl.textContent = this._totalCalories;
	}

	_displayCaloriesLimit() {
		const calorieLimitEl = document.getElementById('calories-limit');
		calorieLimitEl.textContent = this._calorieLimit;
	}

	_displayCaloriesConsumed() {
		const caloriesConsumedEl = document.getElementById('calories-consumed');
		const caloriesConsumed = this._meals.reduce((total, meal) => total + meal.calories, 0);
		caloriesConsumedEl.textContent = caloriesConsumed;
	}

	_displayCaloriesBurned() {
		const caloriesBurnedEl = document.getElementById('calories-burned');
		const caloriesBurned = this._workouts.reduce((total, workout) => total + workout.caloriesBurned, 0);
		caloriesBurnedEl.textContent = caloriesBurned;
	}

	_displayCaloriesRemaining() {
		const caloriesRemainingEl = document.getElementById('calories-remaining');
		const caloriesRemaining = this._calorieLimit - this._totalCalories;
		caloriesRemainingEl.textContent = caloriesRemaining;

		if (caloriesRemaining < 0) {
			caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-light');
			caloriesRemainingEl.parentElement.parentElement.classList.add('bg-danger');
		} else {
			caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-danger');
			caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light');
		}
	}

	_displayCaloriesProgress() {
		const progressEl = document.getElementById('calorie-progress');
		const percentage = (this._totalCalories / this._calorieLimit) * 100;
		const width = Math.min(percentage, 100);
		progressEl.style.width = `${width}%`;

		const caloriesRemaining = this._calorieLimit - this._totalCalories;

		if (caloriesRemaining < 0) {
			progressEl.classList.add('bg-danger');
		} else {
			progressEl.classList.remove('bg-danger');
		}
	}

	_displayNewMeal(meal) {
		const { id, name, calories } = meal;

		const mealEl = document.createElement('div');
		mealEl.classList.add('card', 'my-2');
		mealEl.setAttribute('data-id', id);
		mealEl.innerHTML = `
			<div class="card-body">
				<div class="d-flex align-items-center justify-content-between">
					<h4 class="mx-1">${name}</h4>
					<div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">${calories}</div>
					<button class="delete btn btn-danger btn-sm mx-2">
						<i class="fa-solid fa-xmark"></i>
					</button>
				</div>
			</div>
		`;
		document.getElementById('meal-items').appendChild(mealEl);
	}

	_displayNewWorkout(workout) {
		const { id, name, caloriesBurned } = workout;

		const workoutEl = document.createElement('div');
		workoutEl.classList.add('card', 'my-2');
		workoutEl.setAttribute('data-id', id);
		workoutEl.innerHTML = `
			<div class="card-body">
				<div class="d-flex align-items-center justify-content-between">
					<h4 class="mx-1">${name}</h4>
					<div class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5">${caloriesBurned}</div>
					<button class="delete btn btn-danger btn-sm mx-2">
						<i class="fa-solid fa-xmark"></i>
					</button>
				</div>
			</div>
		`;
		document.getElementById('workout-items').appendChild(workoutEl);
	}

	_render() {
		this._displayCaloriesLimit();
		this._displayCaloriesTotal();
		this._displayCaloriesConsumed();
		this._displayCaloriesBurned();
		this._displayCaloriesRemaining();
		this._displayCaloriesProgress();
	}
}

export default CalorieTracker;
