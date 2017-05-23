// Characters and talking

class DialogueManager {
  constructor(speaker, track, targetName, targetText) {
    this.speaker = speaker;
    this.track = track;
    this.trackIndex = -1;
    this.boundFunctions = new Map();
    this.boundValues = new Map();
    this.targetName = targetName;
    this.targetText = targetText;
    this.typing = false;
    this.typewriterID = 0;
  }

  bindFunction(index, func, args) {
    this.boundFunctions.set(index, [func, args]);
  }

  isBoundFunc(index) {
    return (this.boundFunctions.get(index) != null);
  }

  bindValue(index, targetVar, newValue) {
    var valueHash = targetVar + ";" + newValue;
    var currentHashes = (this.boundValues.get(index)) ? this.boundValues.get(index) : [];
    currentHashes.push(valueHash);
    this.boundValues.set(index, currentHashes);
  }

  clear() {
    this.speaker = null;
    this.track = null;
    this.trackIndex = -1;
  }

  index() {
    return this.trackIndex;
  }

  hide() {
    this.targetText.alpha = 0;
  }

  show() {
    this.targetName.alpha = 1;
    this.targetText.alpha = 1;
  }

  isBound(index) {
    return (this.boundValues.get(index) != null);
  }

  getSpeaker() {
    return this.speaker;
  }

  getTrack() {
    return this.track;
  }

  setSpeaker(speaker) {
    this.speaker = speaker;
  }

  setTrack(track) {
    this.track = track;
  }

  setTyping(typing) {
    this.typing = typing;
  }

  hasNext() {
    return typeof this.track.get(this.trackIndex + 1) != "undefined";
  }

  hasPrev() {
    if(this.track.get(this.trackIndex - 1) != null) {
      return true;
    }
    return false;
  }

  iterated() {
    return !this.hasNext() && !this.typing;
  }

  next() {
    if(this.hasNext()) {
      this.targetText.text = "";
      if(!this.typing) {
        this.typing = true;
        this.trackIndex++;
        this.typewriterID = GameGraphics.typeText(this.targetText, this.track.get(this.trackIndex), 30, "CHAR", "/game/assets/sound/text_type.wav", function() { this.setTyping(false); }, this);
        if(this.isBound(this.trackIndex)) {
          var hashes = this.boundValues.get(this.trackIndex);
          for(var i = 0; i < hashes.length; i++) {
            var dir = hashes[i].split(";");
            switch(dir[0].toLowerCase()) {
              case "targetname":
                this.targetName.text = dir[1];
                break;
              case "targettext":
                this.targetText.text = dir[1];
                break;
              default:
                break;
            }
          }
        }
      } else {
        this.typing = false;
        clearInterval(this.typewriterID);
        this.targetText.text = "";
        this.targetText.text = this.track.get(this.trackIndex);
      }

      if(this.isBoundFunc(this.trackIndex)) {
        var funcSet = this.boundFunctions.get(this.trackIndex);
        funcSet[0].apply(null, funcSet[1]);
      }
    }
  }

}

class DialogueTrack {
  constructor(track) {
    this.track = track;
  }

  get(index) {
    return this.track[index];
  }

  getSize() {
    return this.track.length;
  }
}

class DialogueSpeaker {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return name;
  }

  setName(name) {
    this.name = name;
  }
}

// Choices, choices, choices.

class DecisionMenu {
  constructor(choiceKeys, choiceValues) {
    this.choiceKeys = (choiceKeys) ? choiceKeys : new Array();
    this.choiceValues = (choiceValues) ? choiceValues : new Array();
    this.choiceIndex = 0;
    this.chosen = false;
  }

  bind(choice, choiceText) {
    this.choiceKeys.push(choice);
    this.choiceValues.push(choiceText);
  }

  clear() {
    this.choiceIndex = 0;
    this.choiceKeys = [];
    this.choiceValues = [];
  }

  index() {
    return this.choiceIndex;
  }

  iterated() {
    return this.chosen;
  }

  next() {
    GameGraphics.scaleTo(this.choiceValues[this.choiceIndex], 1, 200);

    if((this.choiceIndex + 1) >= this.choiceValues.length) {
      this.choiceIndex = 0;
    } else {
      this.choiceIndex++;
    }

    GameGraphics.scaleTo(this.choiceValues[this.choiceIndex], 1.3, 50);
  }

  prev() {
    GameGraphics.scaleTo(this.choiceValues[this.choiceIndex], 1, 200);

    if((this.choiceIndex - 1) < 0) {
      this.choiceIndex = (this.choiceValues.length - 1);
    } else {
      this.choiceIndex--;
    }

    GameGraphics.scaleTo(this.choiceValues[this.choiceIndex], 1.3, 50);
  }

  getChoice() {
    return this.choiceKeys[this.choiceIndex];
  }

  setChosen(boolean) {
    this.chosen = boolean;
  }

  hide() {
    for(var i = 0; i < this.choiceValues.length; i++) {
      this.choiceValues[i].alpha = 0;
    }
  }

  show() {
    for(var i = 0; i < this.choiceValues.length; i++) {
      this.choiceValues[i].alpha = 1;
    }
  }

}

// CUT!

class DialogueEnd {
  constructor(advance) {
    this.elems = arguments;
    this.advance = advance;
  }

  next() {
    for(var i = 0; i < this.elems.length; i++) {
      GameGraphics.slideTo(this.elems[i], this.elems[i].x, 700, 150);
    }
  }

  iterated() {
    return true;
  }

  hide() {

  }

  show() {

  }
}

class DialogueAdvanceStage {
  constructor(timeout, keepMusic) {
    this.timeout = timeout;
    this.keepMusic = keepMusic;
  }

  iterated() {
    return true;
  }

  next() {
    setTimeout(function () {
      nextStage();
      window.location = hashToURL("menu/loading");
      if(!this.keepMusic) {
        window.parent.stopBGMusic();
      }
    }, this.timeout);
  }

  prev() { ; }

  hide() { ; }

  show() { ; }
}

class DialogueRedirect {
  constructor(destinationHash, timeout, keepMusic, advanceStage) {
    this.destinationHash = destinationHash;
    this.keepMusic = keepMusic;
    this.timeout = timeout;
    this.advanceStage = advanceStage;
  }

  iterated() {
    return true;
  }

  next() {
    var classThis = this;
    setTimeout(function() {
      if(classThis.advanceStage) {
        nextStage();
      }
      if(!classThis.keepMusic) {
        window.parent.stopBGMusic();
      }
      window.location = hashToURL(classThis.destinationHash);
    }, classThis.timeout);
  }

  prev() { ; }

  hide() { ; }

  show() { ; }
}

// Bringing it together

class InteractionTrack {
  constructor() {
    this.boundFunctions = new Map();
    this.track = arguments;
    this.trackIndex = 0;
    this.started = false;
  }

  bindFunction(index, func, args) {
    this.boundFunctions.set(index, [func, args]);
  }

  isBound(index) {
    return (this.boundFunctions.get(index) != null);
  }

  hasNext() {
    return (this.trackIndex < (this.track.length));
  }

  next() {
    if(this.isStarted()) {
      if(this.hasNext()) {
        this.getCurrent().hide();
        this.getNext().next();
        this.getCurrent().show();

        if(this.isBound(this.trackIndex)) {
          var funcSet = this.boundFunctions.get(this.trackIndex);
          funcSet[0].apply(null, funcSet[1]);
        }

        if(this.getCurrentType() == "DialogueEnd") {
          if(this.getCurrent().advance) {
            var self = this;
            setTimeout(function() {
              self.next();
            }, 160);
          }
        }
      }
    }
  }

  prev() {
    var currentItem = this.track[this.trackIndex];
    if(currentItem.constructor.name == "DecisionMenu") {
      currentItem.prev();
    }
  }

  end() {
    this.started = false;
  }

  start() {
    this.started = true;
  }

  stop() {
    this.started = false;
  }

  isStarted() {
    return this.started;
  }

  getCurrent() {
    return this.track[this.trackIndex];
  }

  getCurrentType() {
    return this.getCurrent().constructor.name;
  }

  getNext() {
    if(this.track[this.trackIndex].iterated()) {
      this.trackIndex++;
    }

    return this.track[this.trackIndex];
  }

  getTrack() {
    return this.track;
  }

  setTrack() {
    this.track = arguments;
  }
}
