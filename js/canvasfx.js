class GameGraphics {
  static fade(target, newAlpha, duration) {
    return createjs.Tween.get(target, { loop: false })
			.to({ alpha: newAlpha }, duration);
  }

  static hide(target, timeout) {
    setTimeout(function() {
      target.alpha = 0;
    }, timeout);
  }

  static scaleTo(target, factor, duration) {
    return createjs.Tween.get(target, { loop: false })
      .to({ scaleX: factor, scaleY: factor }, duration);
  }

  static show(target, timeout) {
    setTimeout(function() {
      target.alpha = 1;
    }, timeout);
  }

  static slideTo(target, posX, posY, duration) {
    return createjs.Tween.get(target, { loop: false })
      .to({ x: posX, y: posY }, duration);
  }

  static typeText(target, text, step, stepType, stepSound, callback, owner) {
    var stepChar;
    var typeInterval;
    switch(stepType) {
      case "CHAR":
        stepChar = "";
        break;
      case "WORD":
        stepChar = " ";
        break;
      default:
        stepChar = "";
        break;
    }

    if(stepSound) {
      var typeSound = new Howl({
        urls: new Array(stepSound)
      });
    }

    var letters = text.split(stepChar);
    var letterIndex = -1;

    if(!Array.isArray(step)) {
      typeInterval = setInterval(function() {
        if(letterIndex == (letters.length - 1)) {
          clearInterval(typeInterval);
          if(callback && owner) {
            callback.apply(owner);
          }
        } else {
          letterIndex++;
          target.text += letters[letterIndex];

          if(stepType == "WORD") {
            target.text += " ";
          }

          typeSound.play();
        }
      }, step);
    } else {
      $.each(step, function(index, value) {
        typeInterval = setTimeout(function() {
          target.text += letters[index];
          if(stepType == "WORD") {
            target.text += " ";
          }
          typeSound.play();
        }, value);
      });
    }

    return typeInterval;
  }
}

function hidePhaserDialog() {
  window.parent.soundfx.play();
  popup.visible = false;
  nametext.visible = false;
  nametag.visible = false;
}

function showPhaserDialog() {
  window.parent.soundfx.play();
  popup.visible = true;
  nametext.visible = true;
  nametag.visible = true;
}

function togglePhaserDialog() {
  window.parent.soundfx.play();
  popup.visible = (popup.visible) ? false : true;
  nametext.visible = (nametext.visible) ? false : true;
  nametag.visible = (nametag.visible) ? false : true;
}

function setDialogMessage(message) {
  text.text = message;
}

function setDialogSpeaker(speaker) {
  nametext.text = speaker;
}

function resetInv() {
  inv_text_1.text = inv_text_1.text.replace("-> ", "");
  inv_text_2.text = inv_text_2.text.replace("-> ", "");
  inv_text_3.text = (!window.parent.hasTorch) ? "?????????" : "Blowtorch";
  inv_text_4.text = (!window.parent.hasPick) ? "???????" : "Pickaxe";
}
