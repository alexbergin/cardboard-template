"use strict"

module.exports = class SubClass

	constructor: ( parent ) ->

		@.parent = parent

		if not @.parent.root? then @.root = @.parent
		else @.root = @.parent.root

		@.init?()