'use strict'
var gCelectLine = 0;
const KEY = 'memeDB';
var gMemsToStorage = _createSavedMemes();
//  var gMemsToStorage=[];
var gKeywords = {
    'happy': 1,
    'funny': 1,
    'men': 1,
    'famous': 1,
    'animal': 1,
    'baby': 1,
    'love': 1,
    'smile': 1,


}
var keywords = ['happy', 'funny', 'men', 'famous', 'animal', 'love', 'smile'];
var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['funny', 'men', 'famous'] },
    { id: 2, url: 'img/2.jpg', keywords: ['animal', 'love'] },
    { id: 3, url: 'img/3.jpg', keywords: ['animal', 'love', 'baby'] },
    { id: 4, url: 'img/4.jpg', keywords: ['amimal'] },
    { id: 5, url: 'img/5.jpg', keywords: ['funny', 'baby'] },
    { id: 6, url: 'img/6.jpg', keywords: ['funny', 'men', 'smile'] },
    { id: 7, url: 'img/7.jpg', keywords: ['happy', 'funny'] },
    { id: 8, url: 'img/8.jpg', keywords: ['happy', 'men'] },
    { id: 9, url: 'img/9.jpg', keywords: ['happy', 'funny', 'baby', 'smile', 'famous'] },
    { id: 10, url: 'img/10.jpg', keywords: ['happy', 'men', 'smile'] },
    { id: 11, url: 'img/11.jpg', keywords: ['funny', 'men', 'love'] },
    { id: 12, url: 'img/12.jpg', keywords: ['men', 'famous'] },
    { id: 13, url: 'img/13.jpg', keywords: ['famous', 'men'] },
    { id: 14, url: 'img/14.jpg', keywords: ['men'] },
    { id: 15, url: 'img/15.jpg', keywords: ['famous', 'men', 'happy'] },
    { id: 16, url: 'img/16.jpg', keywords: ['happy', 'funny', 'men'] },
    { id: 17, url: 'img/17.jpg', keywords: ['famous', 'men'] },
    { id: 18, url: 'img/18.jpg', keywords: ['smile'] }

];
var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    selectedStickerIdx: -1,
    lines: [{ txt: 'Text', size: 40, align: 'left', color: 'white', strokeStyle: 'black', fontFamily: 'Ariel', x: 100, y: 100 }],
    stickers: []
}
var gStickers = [
    { idSricker: 1, url: 'stickers/smile.svg ' },
    { idSricker: 2, url: 'stickers/hat.svg ' },
    { idSricker: 3, url: 'stickers/sunGlass.svg' },
    { idSricker: 4, url: 'stickers/wig.svg ' }


];
function saveStickerToMeme(stickerUrl, width, height, img) {
    var sticker = { url: stickerUrl, x: 250, y: 250, width, height, img }

    gMeme.stickers.push(sticker);

}
function updateStickerClick(clickedSticker) {
    gMeme.selectedStickerIdx = clickedSticker;

}
function updateStickerPos(x, y) {
    gMeme.stickers[gMeme.selectedStickerIdx].x = x;
    gMeme.stickers[gMeme.selectedStickerIdx].y = y;
}
function _createSavedMemes() {
    var savedMemes = loadFromStorage(KEY);
    if (!savedMemes || !savedMemes.length) savedMemes = [];
    return savedMemes;
}
function getGalleryForDisplay() {
    return gImgs;
}
function getStickersForDisplay() {
    console.log(gStickers);
    return gStickers;
}

function drawImg(imgId) {
    var img = gImgs.find(currImg => {
        return imgId === currImg.id
    })
    gMeme.selectedImgId = img.id;
    // gMeme.selectedLineIdx = 0;


    return img;

}
function addLine() {
    gCelectLine++;
    console.log(gCelectLine);
    if (gCelectLine === 1) gMeme.lines.push({ txt: '', size: 40, align: 'left', color: 'white', strokeStyle: 'black', fontFamily: 'Ariel', x: 100, y: 400 })
    else if (gCelectLine === 2) gMeme.lines.push({ txt: '', size: 40, align: 'left', color: 'white', strokeStyle: 'black', fontFamily: 'Ariel', x: 100, y: 250 })
    else if (gCelectLine === 4) return
    gMeme.selectedLineIdx = gCelectLine;


}
function clearGmeme() {
    gMeme.lines.forEach((line, idx) => {
        if (idx === 0) return;
        line.txt = '';
    })

}

function addText(text) {
    console.log(text);
    console.log('linsSelect', gMeme.selectedLineIdx);
    gMeme.lines[gMeme.selectedLineIdx].txt = text
}
function changeTextSize(diff) {
    gMeme.lines[gMeme.selectedLineIdx].size += diff;
}
function  changeStickerSize(diff){
    console.log('check');
    gMeme.stickers[gMeme.selectedStickerIdx].height+=diff*2
    gMeme.stickers[gMeme.selectedStickerIdx].width+=diff*2
}
function setFillStyle(fillStyle) {
    gMeme.lines[selectedLineIdx].color = fillStyle;
    
}
function setSelectImg(imgId) {
    gMeme.selectedImgId = imgId;
    
}
function getSelectImg() {
    return gImgs[gMeme.selectedImgId - 1].url;
}
function getMemeForDisplay() {
    return gMeme;
}
function setTextalign(dir) {
    console.log(gMeme.lines[gMeme.selectedLineIdx].align)
    gMeme.lines[gMeme.selectedLineIdx].align = `${dir}`;
   

}
function getKeyWordForDisplay() {
    return gKeywords;
}
function getArrKeyWordForDisplay() {
    return keywords;
}
function updateKeyWords(word) {
    gKeywords[word]++;
}
function moveLines() {
    console.log('120');
    gCelectLine++;
    console.log(gCelectLine);
    if (gCelectLine === gMeme.lines.length) gCelectLine = 0;
    gMeme.selectedLineIdx = gCelectLine;
    document.querySelector('input[name="txtLine"]').value = gMeme.lines[gMeme.selectedLineIdx].txt;
   

}
function deleteLine() {

    
    gMeme.lines.splice(gCelectLine, 1);
    if (gCelectLine > 0) gCelectLine = gCelectLine - 1;
    document.querySelector('input[name="txtLine"]').value = ''
   

}
function changeFillColor(fillStyle) {
    console.log(fillStyle);
    gMeme.lines[gMeme.selectedLineIdx].color = fillStyle;
    
}
function changeStokeStyle(strokeColor) {
    console.log(strokeColor);
    gMeme.lines[gMeme.selectedLineIdx].strokeStyle = strokeColor;
    
}
function downloadCanvas(elLink) {
    const data = gCanvas.toDataURL();
    console.log(data)
    elLink.href = data;
    elLink.download = 'my-img.jpg';
}
function changeFontFamily(fontFamily) {
    gMeme.lines[gMeme.selectedLineIdx].fontFamily = fontFamily;
   
}

function _saveMemesToStorage() {
    saveToStorage(KEY, gMemsToStorage)
}
function updateLineClicked(clickedStar) {
    console.log('star', clickedStar);
    gMeme.selectedLineIdx = clickedStar;
    gCelectLine = clickedStar;
  
}
function upLine() {
    if (gMeme.lines[gMeme.selectedLineIdx].y === 40) return
    gMeme.lines[gMeme.selectedLineIdx].y -= 20
}
function downLine() {
    if (gMeme.lines[gMeme.selectedLineIdx].y === (460)) return
    gMeme.lines[gMeme.selectedLineIdx].y += 20
}

function saveMemes(meme) {
    console.log('befor:', meme);
    gMemsToStorage.push({ id: meme.selectedImgId, url: meme.toDataURL() })
    console.log('after:', gMemsToStorage);
    _saveMemesToStorage()

}
function updateGmeme(gCurrX, gCurrY) {
    gMeme.lines[gMeme.selectedLineIdx].x = gCurrX;
    gMeme.lines[gMeme.selectedLineIdx].y = gCurrY;

}
function findUrlSticker(stickerId) {
    var sticker = gStickers.find(currSticker => {
        return currSticker.id === stickerId
    })
    if (!sticker) return sticker.url
}
function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('http://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
    .then(function (res) {
        return res.text()
    })
    .then(onSuccess)
    .catch(function (err) {
        console.error(err)
    })
}