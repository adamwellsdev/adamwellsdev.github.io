(function () {
	if (typeof Relativity === 'undefined') {
		window.Relativity = {};
	}

	var Asteroid = Relativity.Asteroid = function (options) {
		Relativity.Moveable.call(this, options);

		this.rad = options.rad;
		this.level = options.level;
		this.generateVertices();
	}

	Relativity.Helpers.inherits(Asteroid, Relativity.Moveable);

	Asteroid.RADIUS = 35;
	Asteroid.SPLIT_NUMBER = 2;

	Asteroid.prototype.update = function () {
		this.move();
	}

	Asteroid.prototype.draw = function (ctx) {
		ctx.save();
		this.drawAt(ctx, this.pos)
		this.drawAt(ctx, [this.pos[0], this.pos[1] - this.game.height])
		this.drawAt(ctx, [this.pos[0], this.pos[1] + this.game.height])
		this.drawAt(ctx, [this.pos[0] - this.game.width, this.pos[1]])
		this.drawAt(ctx, [this.pos[0] + this.game.width, this.pos[1]])
		this.drawAt(ctx, [this.pos[0] - this.game.width, this.pos[1] - this.game.height])
		this.drawAt(ctx, [this.pos[0] + this.game.width, this.pos[1] + this.game.height])
		this.drawAt(ctx, [this.pos[0] - this.game.width, this.pos[1] - this.game.height])
		this.drawAt(ctx, [this.pos[0] + this.game.width, this.pos[1] + this.game.height])
		ctx.restore();
	}

	// Asteroid.prototype.drawAt = function (ctx, pos) {
	// 	ctx.save();
	// 	ctx.strokeStyle = 'white';
	// 	ctx.translate(pos[0], pos[1]);
	// 	ctx.beginPath();
	// 	ctx.arc(0, 0, this.rad, 0, Math.PI*2);
	// 	ctx.closePath();
	// 	ctx.stroke();
	// 	ctx.restore();
	// }

	Asteroid.prototype.drawAt = function (ctx, pos) {
		ctx.save();
		ctx.strokeStyle = 'white';
		ctx.translate(pos[0], pos[1]);
		ctx.beginPath();
		ctx.moveTo(this.vertices[0][0], this.vertices[0][1]);
		for (var i = 1; i < this.vertices.length; i++) {
			ctx.lineTo(this.vertices[i][0], this.vertices[i][1]);
		}
		ctx.lineTo(this.vertices[0][0], this.vertices[0][1]);
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
	}

	Asteroid.prototype.checkBulletCollision = function (bullet) {
		var updatedVertices = [];
		this.vertices.forEach(function (vertex) {
			updatedVertices.push([vertex[0] + this.pos[0], vertex[1] + this.pos[1]]);
		}.bind(this));

		if (Relativity.Helpers.pointInsidePoly(bullet.pos, updatedVertices)) {
			this.game.score += 10 * (this.level + 1);
			this.getHit(bullet);
		}
	}

	// Asteroid.prototype.checkBulletCollision = function (bullet) {
	// 	var xDist = this.pos[0] - bullet.pos[0];
	// 	var yDist = this.pos[1] - bullet.pos[1];
	// 	var dist = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
	// 	if (dist < this.rad + bullet.rad) {
	// 		this.game.score +=  10 * (this.level + 1);
	// 		this.getHit(bullet);
	// 	}
	// }

	Asteroid.prototype.getHit = function (bullet) {
		var bulletIndex = this.game.bullets.indexOf(bullet);
		this.game.bullets.splice(bulletIndex, 1);

		var asteroidIndex = this.game.asteroids.indexOf(this);
		this.game.asteroids.splice(asteroidIndex, 1);

		if (this.level > 0) {
			this.multiply();
		}
	}

	Asteroid.prototype.multiply = function () {
		var asteroidArgs = {};
		for (var i = 0; i < Asteroid.SPLIT_NUMBER; i++) {
			asteroidArgs = { pos: this.pos.slice(0),
											 vel: [Math.random() - .5, Math.random() - .5],
											 rad: this.rad * .5,
											 game:  this.game,
											 level: this.level - 1 }
			var asteroid = new Relativity.Asteroid(asteroidArgs);
			this.game.asteroids.push(asteroid);
		}
	}

	Asteroid.prototype.checkShipCollision = function (ship) {
		if (Relativity.Helpers.distance(this, ship) < this.rad) {
			ship.collide();
		}
	}

	Asteroid.prototype.generateVertices = function () {
		this.vertices = [];
		var numSides = Math.floor(5 + Math.random() * 3);
		var angles = [];
		for (var i = 0; i < numSides; i++) {
			angles.push(Math.random() * 2 * Math.PI);
		}
		angles.sort();
		for (var i = 0; i < numSides; i++) {
			var position = [Math.cos(angles[i]) * this.rad, Math.sin(angles[i]) * this.rad];
			this.vertices.push(position);
		}
	}
})();