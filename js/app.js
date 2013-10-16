// Model Zone
var Todo = function Todo() {

	this.message = "";
	this.completed = false;

};

// View Zone

var View = function View() {
};

View.prototype.setHTML = function setHTML(html) {
	this.element.innerHTML = html;
};

View.prototype.render = function render() {
};

var TodoView = function TodoView() {
	this.element = document.createElement('li');
	this.model = null;

	var self = this;
	this.element.addEventListener('click', function(e) {
		self.onClick(e);
	});
};

TodoView.prototype = new View();

TodoView.prototype.onClick = function onClick(e) {
	this.model.completed = !this.model.completed;
	this.parentView.render();
};

TodoView.prototype.render = function render() {
	View.prototype.render.apply(this, arguments);

	var html = "";

	if (this.model) {
		html += "<input type=checkbox" + (this.model.completed ? " checked" : "") + ">";
		html += this.model.message;
	}

	this.setHTML(html);
};

var TodoListView = function TodoListView() {
	this.element = document.createElement('div');
	this.todos = [];
};

TodoListView.prototype = new View();

TodoListView.prototype.countCompleted = function countCompleted() {
	var completedCount = 0;
	for (var i = 0; i < this.todos.length; i++) {
		if (this.todos[i].completed) {
			completedCount++;
		}
	}
	return completedCount;
};

TodoListView.prototype.countUncompleted = function countUncompleted() {
	return this.todos.length - this.countCompleted();
};

TodoListView.prototype.render = function render() {
	View.prototype.render.apply(this, arguments);

	this.element.innerHTML = this.countCompleted() + " out of " + this.todos.length;

	var listContainer = document.createElement('ol');

	for (var i = 0; i < this.todos.length; i++) {
		var tv = new TodoView();
		tv.parentView = this;
		tv.model = this.todos[i];
		tv.render();

		listContainer.appendChild(tv.element);
	}

	this.element.appendChild(listContainer);
};
