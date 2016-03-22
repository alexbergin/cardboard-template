"use strict"

View = require "./modules/View"

class App

	constructor: ->

		@.view = new View @
		@.loop()

	loop: ->

		tasks = []
		for task in tasks
			@[task].loop?()

new App