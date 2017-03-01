console.log('script.js speaking')

var bgcolor = 'slategrey'
var score = 0
var playing = true
var shadow = 'inset 0 0 4px #000000'

var Piece = function (type) {
  this.base = [4, 1]
  this.type = type || Math.floor(1 + Math.random() * 7)
  switch (this.type) {
    case 1:
      this.name = 'O'
      this.blocks = [[1, 0], [1, 1], [0, 1]] // O
      this.color = 'deeppink'
      break
    case 2:
      this.name = 'I'
      this.blocks = [[-1, 0], [1, 0], [2, 0]] // I
      this.color = 'cyan'
      break
    case 3:
      this.name = 'Z'
      this.blocks = [[0, -1], [1, 0], [1, 1]] // S
      this.color = 'green'
      break
    case 4:
      this.name = 'S'
      this.blocks = [[0, -1], [-1, 0], [-1, 1]] // Z
      this.color = 'darkred'
      break
    case 5:
      this.name = 'J'
      this.blocks = [[0, 1], [0, -1], [-1, -1]] // J
      this.color = 'blue'
      break
    case 6:
      this.name = 'L'
      this.blocks = [[0, 1], [0, -1], [1, -1]] // L
      this.color = 'tomato'
      break
    case 7:
      this.name = 'T'
      this.blocks = [[0, 1], [1, 0], [-1, 0]] // T
      this.color = 'indigo'
      break
  }
}

Piece.prototype.cantSpawn = function () {
  if (!spaceFree(this.base[0], this.base[1])) {
    return true
  }

  for (var i = 0; i < 3; i++) {
    if (!spaceFree(this.base[0] + this.blocks[i][0], this.base[1] - this.blocks[i][1])) {
      return true
    }
  }
  return false
}

Piece.prototype.tryClear = function () {
  var toCheck = this.getWhys()
  var multiplier = 0
  for (i = 0; i < toCheck.length; i++) {
    var breaker = false

    for (j = 0; j < 10; j++) {
      if (spaceFree(j, toCheck[i])) {
        breaker = true
        break
      }
    }
    if (!breaker) {
      multiplier++

      score = score + (multiplier * 10)
      for (j = toCheck[i]; j > 0; j--) {
        for (k = 0; k < 10; k++) {
          document.getElementById(id(k, j)).style.backgroundColor = document.getElementById(id(k, j - 1)).style.backgroundColor
          document.getElementById(id(k, j)).style.borderRadius = document.getElementById(id(k, j - 1)).style.borderRadius
          document.getElementById(id(k, j)).style.boxShadow = document.getElementById(id(k, j - 1)).style.boxShadow
        }
      }
      for (z = i + 1; z < toCheck.length; z++) {
        if (toCheck[z] < toCheck[i] && toCheck[z] < 16) {
          toCheck[z] += 1
        }
      }
    }
  }

  document.getElementById('score').innerHTML = 'Score: ' + score
}

Piece.prototype.getWhys = function () {
  var result = []
  var theBase = this.base[1]
  result.push(theBase)
  for (i = 0; i < 3; i++) {
    result.push(theBase - this.blocks[i][1])
  }
  return result.filter(onlyUnique)
}

Piece.prototype.rotateRight = function () {
  if (t.canRotateRight()) {
    this.erase()
    for (i = 0; i < 3; i++) {
      this.blocks[i] = [this.blocks[i][1], -1 * this.blocks[i][0]]
    }
    this.update()
  }
}

Piece.prototype.canRotateRight = function () {
  for (i = 0; i < 3; i++) {
    x = this.blocks[i][1]
    y = this.blocks[i][0] * -1
    if (this.base[0] + x < 0 || this.base[0] + x > 9 || this.base[1] - y > 16) {
      return false
    }
    if (!spaceFree(this.base[0] + x, this.base[1] - y)) {
      return false
    }
  }
  return true
}

Piece.prototype.rotateLeft = function () {
  if (t.canRotateLeft()) {
    this.erase()
    for (i = 0; i < 3; i++) {
      this.blocks[i] = [ -1 * this.blocks[i][1], this.blocks[i][0]]
    }
    this.update()
  }
}

Piece.prototype.canRotateLeft = function () {
  for (i = 0; i < 3; i++) {
    x = this.blocks[i][1] * -1
    y = this.blocks[i][0]
    if (this.base[0] + x < 0 || this.base[0] + x > 9 || this.base[1] - y > 16) {
      return false
    }
    if (!spaceFree(this.base[0] + x, this.base[1] - y)) {
      return false
    }
  }
  return true
}

Piece.prototype.print = function () {
  console.log(this.name, this.color)
}

Piece.prototype.update = function () {
  document.getElementById(id(this.base[0], this.base[1])).style.backgroundColor = this.color
  document.getElementById(id(this.base[0], this.base[1])).style.boxShadow = shadow
  for (i = 0; i < 3; i++) {
    document.getElementById(id(this.base[0] + this.blocks[i][0], this.base[1] - this.blocks[i][1])).style.backgroundColor = this.color
    document.getElementById(id(this.base[0] + this.blocks[i][0], this.base[1] - this.blocks[i][1])).style.boxShadow = shadow
  }
}

Piece.prototype.erase = function () {
  document.getElementById(id(this.base[0], this.base[1])).style.backgroundColor = bgcolor
  document.getElementById(id(this.base[0], this.base[1])).style.boxShadow = 'none'
  for (i = 0; i < 3; i++) {
    document.getElementById(id(this.base[0] + this.blocks[i][0], this.base[1] - this.blocks[i][1])).style.backgroundColor = bgcolor
    document.getElementById(id(this.base[0] + this.blocks[i][0], this.base[1] - this.blocks[i][1])).style.boxShadow = 'none'
  }
}

Piece.prototype.shift = function (x, y) {
  if (this.canShift(x, y)) {
    this.erase()
    this.base = [this.base[0] + x, this.base[1] - y]
    this.update()
  }
}

Piece.prototype.canShift = function (x, y) {
  if (this.base[0] + x < 0 || this.base[0] + x > 9) {
    return false
  }
  if (!spaceFree(this.base[0] + x, this.base[1] - y)) {
    return false
  }
  for (i = 0; i < 3; i++) {
    if (this.base[0] + this.blocks[i][0] + x < 0 || this.base[0] + this.blocks[i][0] + x > 9) {
      return false
    }
    if (!spaceFree(this.base[0] + this.blocks[i][0] + x, this.base[1] - this.blocks[i][1] - y)) {
      return false
    }
  }
  return true
}

Piece.prototype.canGoDown = function () {
  if (this.base[1] == 16) {
    return false
  }
  for (i = 0; i < 3; i++) {
    if (this.base[1] - this.blocks[i][1] == 16) {
      return false
    }
  }
  if (!this.canShift(0, -1)) {
    return false
  }
  return true
}

Piece.prototype.place = function () {
  document.getElementById(id(this.base[0], this.base[1])).style.borderRadius = '0px'
  for (i = 0; i < 3; i++) {
    document.getElementById(id(this.base[0] + this.blocks[i][0], this.base[1] - this.blocks[i][1])).style.borderRadius = '0px'
  }
  t.print()
}


function appendBoxes () {
  for (i = 0; i < 170; i++) {
    if (i % 10 == 0) {
      var box1 = '<div class="box breaker" id=' + id(Math.floor(i % 10), Math.floor(i / 10)) + '></div>'
    } else {
      var box1 = '<div class="box" id=' + id(Math.floor(i % 10), Math.floor(i / 10)) + '></div>'
    }
    $('.grid').append(box1)
  }
}

function appendSwap () {
  for (i = 0; i < 12; i++) {
    if (i % 4 == 0) {
      var box2 = '<div class="box breaker" id=' + idz(Math.floor(i % 4), Math.floor(i / 4)) + '></div>'
    } else {
      var box2 = '<div class="box" id=' + idz(Math.floor(i % 4), Math.floor(i / 4)) + '></div>'
    }
    $('#swappingWeapons').append(box2)
  }
}

function appendPreview () {
  for (i = 0; i < 12; i++) {
    if (i % 4 == 0) {
      var box2 = '<div class="box breaker" id=' + idz(Math.floor(i % 4), Math.floor(i / 4)) + '></div>'
    } else {
      var box2 = '<div class="box" id=' + idz(Math.floor(i % 4), Math.floor(i / 4)) + '></div>'
    }
    $('#futureUse').append(box2)
  }
}

function onlyUnique (value, index, self) {
  return self.indexOf(value) === index
}

function makeSwap (type) {
  for (i = 0; i < 4; i++) {
    for (j = 0; j < 3; j++) {
      document.getElementById(idz(i, j)).style.backgroundColor = 'slategrey'
      document.getElementById(idz(i, j)).style.boxShadow = 'none'
    }
  }

  var newPiece = new Piece(type)
  newPiece.base = [1, 1]
  document.getElementById(idz(newPiece.base[0], newPiece.base[1])).style.backgroundColor = newPiece.color
  document.getElementById(idz(newPiece.base[0], newPiece.base[1])).style.boxShadow = shadow
  for (i = 0; i < 3; i++) {
    document.getElementById(idz(newPiece.base[0] + newPiece.blocks[i][0], newPiece.base[1] - newPiece.blocks[i][1])).style.backgroundColor = newPiece.color
    document.getElementById(idz(newPiece.base[0] + newPiece.blocks[i][0], newPiece.base[1] - newPiece.blocks[i][1])).style.boxShadow = shadow
  }
}

function id (x, y) {
  return x + '.' + y
}

function jid (x, y) {
  return '#' + id(x, y)
}

function idz (x, y) {
  return 'z' + x + y
}

function resetTimer () {
  clearInterval(timer)
  timer = setInterval(function () {
    if (t.canGoDown()) {
      t.shift(0, -1)
    } else {
      t.place()
      t.tryClear()
      t = new Piece()
      if (t.cantSpawn()) {
        clearInterval(timer)
        playing = false
        console.log('Game Over!');
        document.getElementById('status').innerHTML = 'Game Over!'
        return
      }
      t.update()
      hasSwapped = false
      resetTimer()
    }
  }, 300)
}

function spaceFree (x, y) {
  return document.getElementById(id(x, y)).style.borderRadius != '0px'
}

function startGame () {
  var ar = new Array(33, 34, 35, 36, 37, 38, 39, 40)
  $(document).keydown(function (e) {
    var key = e.which
    if ($.inArray(key, ar) > -1) {
      e.preventDefault()
      return false
    }
    return true
  })

  savedType = 10
  hasSwapped = false

  $(document).keydown(function (event) {
    if (playing) {
      if (event.which == 37) {
        t.shift(-1, 0)
      } else if (event.which == 39) {
        t.shift(1, 0)
      } else if (event.which == 38) {
        if (t.type != 1) {
          t.rotateRight()
        }
      } else if (event.which == 90) {
        if (t.type != 1) {
          t.rotateLeft()
        }
      } else if (event.which == 40) {
        if (t.canGoDown()) {
          t.shift(0, -1)
          resetTimer()
        }
      } else if (event.which == 16) {
        if (!hasSwapped) {
          if (savedType == 10) {
            savedType = t.type
            t.erase()
            t = new Piece()
            t.update()
            hasSwapped = true
            makeSwap(savedType)
          } else {
            var toChange = t.type
            t.erase()
            t = new Piece(savedType)
            savedType = toChange
            t.update()
            hasSwapped = true
            makeSwap(savedType)
          }
        }
      }
    }
  })

  appendBoxes()
  appendSwap()
  appendPreview()


  t = new Piece()
  pieces = 0
  t.update()

timer = setInterval(function () {
  if (t.canGoDown()) {
    t.shift(0, -1)
  } else {
    t.place()
    t.tryClear()
    t = new Piece()
    if (t.cantSpawn()) {
      clearInterval(timer)
      return
    }
    t.update()
    resetTimer()
  }
}, 600)
}
