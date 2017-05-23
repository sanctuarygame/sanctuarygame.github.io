// Game constants

window.STAGE_WIDTH = 640;
window.STAGE_HEIGHT = 320;
window.LEFT_X = 0;
window.MIDDLE_X = 320;
window.RIGHT_X = 640;
window.BOTTOM_Y = 320;
window.MIDDLE_Y = 160;
window.TOP_Y = 0;

// Path constants and functions

window.path = [
	"menu/enter",
	"menu/start",
	"visual/wake",
	"visual/pit",
	"visual/maproom",
	"visual/armory",
	"visual/elevatorroom",
	"stage/downwards",
	"visual/nothingpersonal",
	"visual/welcome",
	"visual/end"
];

function hashToURL(hash) {
	return "/game/level/" + hash + ".html";
}

function getCurrentManifest() {
	return "/game/assets/manifest/level/" + path[getStage()] + ".json";
}

function getJSONPath(url) {
	var formattedURL = "/game/assets/map/entitymap/" + url.substring(48, url.length - 5) + ".json";
	return formattedURL.replace(/(.html)[?].+[.]/i,".");
}

function getPlayerSpawn(locationObj) {
	var spawnX, spawnY;
	var search = locationObj.search.substring(1);
	var getVars = search.split("&");
	for(var i = 0; i < getVars.length; i++) {
		var varMap = getVars[i].split("=");
		if(varMap[0] == "x") {
			spawnX = Number(varMap[1]);
		}

		if(varMap[0] == "y") {
			spawnY = Number(varMap[1]);
		}
	}

	if(spawnX == null || spawnY == null) return null;

	return { x: spawnX, y: spawnY };
}

function hasPlayerSpawn(locationObj) {
	return getPlayerSpawn(locationObj) != null;
}

function getStage() {
	return window.parent.gameStage;
}

function nextStage() {
	window.parent.gameStage++;
}

function setStage(stage) {
	window.parent.gameStage = stage;
}

function getGridCoordinates(canvasX, canvasY) {
	return { x: Math.floor(canvasX / 16), y: Math.floor(canvasY / 16) };
}

function queueImageBlob(phaserGame, blobKey, blob) {
	var reader = new window.FileReader();
	reader.readAsDataURL(blob);
	reader.onloadend = function() {
	  dataurl = reader.result;
	  phaserGame.load.image(blobKey, dataurl);
	}
}

// Sound constants

window.MENU_MUSIC = { id: "MENU_MUSIC", url: "/game/assets/sound/Lightless_Dawn.mp3" };
window.SOMBRE_1 = { id: "SOMBRE_1", url: "/game/assets/sound/Blue_Feather.mp3" }
