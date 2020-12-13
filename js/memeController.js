
'use strict'
var gCanvas;
var gCtx;
var gIsMovingLine = false;
var gCurrX;
var gCurrY;
var gDrowSticker = false;
var gStickerX;
var gStickerY;

function onInit() {
    renderKeyWord()
    renderGallery();
    renderStickers()
    gCanvas = document.getElementById('my-canvas')
    gCtx = gCanvas.getContext('2d');
}
function renderGallery() {
    var gallery = getGalleryForDisplay()
    var strHtmls = gallery.map(function (img) {
        return `
        <img  onclick="onGetMeme(${img.id})" class="card-img" src="${img.url}">
        `
    })
    document.querySelector('.gallery-continer').innerHTML = strHtmls.join('')
}
function renderStickers() {
    var stickers = getStickersForDisplay()
    var strHtmls = stickers.map((sticker) => {
        return `
        <img  onclick="onDrawSticker('${sticker.url}',event)" src="${sticker.url}" >
        `
    })
    document.querySelector('.jif').innerHTML = strHtmls.join('')
}
function onDrawSticker(sticker) {
 var meme=getMemeForDisplay()
    var img = new Image();
    img.src = ` ${sticker}`;
    console.log(img.src);

    img.onload = () => {
        gCtx.drawImage(img, 50,250, 50,50) //img,x,y,xend,yend
        saveStickerToMeme(sticker, 50,50,img)
        // renderCanvas();
        //   drawRect(150,70)
    }
}

function onGetSticker(stickerImg, ev) {
    if (ev.type === "mousedown") {
        gDrowSticker = true;
        gImgX = ev.clientX
        gImgY = ev.clientY
    }

    else if (ev.type === "mousemove") {
        if (!gIsMovingLine) return;
        gImgX = ev.clientX
        gImgY = ev.clientY
        if (gImgX >= 500)
            renderCanvas()
    }
    else if (ev.type === "mouseup") {
        gIsMovingLine = false;
    }




}

function onShowGalleryMeme() {

    var memes = loadFromStorage(KEY)
  
    if (!memes || !memes.length) return
    var strHtmls = memes.map((meme) => {
        console.log(meme);

        return `
             <img  onclick="onGetMeme(${meme.id})"  src="${meme.url}">
             `

    })

    document.querySelector('.gallery-continer').innerHTML = strHtmls.join('')
    renderCanvas();



}
function onGetMeme(imgId) {
    document.querySelector('.gallery-continer').style.display = 'none';
    document.querySelector('.main-nav').style.display = 'none'
    document.querySelector('.meme-editor').classList.add('active');
    // debugger;
    setSelectImg(imgId);
    var img = drawImg(imgId)
    renderCanvas()


}
function onShowGallery() {
    renderGallery()
    clearGmeme();
    // onInit();
    document.querySelector('.meme-editor').classList.remove('active');
    document.querySelector('.main-nav').style.display = 'flex'

    document.querySelector('.gallery-continer').style.display = 'block';



}
function renderCanvas() {
    var currImg = getSelectImg();
    var meme=getMemeForDisplay()

    var img = new Image();

    img.src = ` ${currImg}`;

    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height) //img,x,y,xend,yend
        drawText();
        if(meme.selectedLineIdx!==-1)drawRect()
       drawStickers()
       
    }

}
function drawStickers() {
    const meme = getMemeForDisplay();
    meme.stickers.forEach(function (sticker) {
        var img = new Image();
        img.src = ` ${sticker.url}`;
    
        img.onload = () => {
            gCtx.drawImage(img, sticker.x,sticker.y,sticker.width,sticker.height) //img,x,y,xend,yend
            // saveStickerToMeme(stickerUrl,width,height,img)
        }
       
        

    });

}
function drawRect() {

    var memes = getMemeForDisplay();
    var letterSize = (memes.lines[memes.selectedLineIdx].size) / 2
    var heightRect = memes.lines[memes.selectedLineIdx].size;
    var widthRect = (memes.lines[memes.selectedLineIdx].txt.length * letterSize) + memes.lines[memes.selectedLineIdx].size * 2;
    gCtx.beginPath()
    gCtx.strokeStyle = 'black'
    gCtx.rect(memes.lines[memes.selectedLineIdx].x - memes.lines[memes.selectedLineIdx].size, memes.lines[memes.selectedLineIdx].y - memes.lines[memes.selectedLineIdx].size, widthRect, heightRect * 2) // x,y,widht,height
    gCtx.stroke()

}

function onRenderTxt(txt) {
    addText(txt)

    renderCanvas()
}
function onRenderSearchPic(keySearch) {
    var keyWords = getArrKeyWordForDisplay();
    var gallery = getGalleryForDisplay()
    var strHtml = gallery.map(function (img) {
        var currImg = img;
        //  console.log(gCurrImg);
        var imgs = img.keywords.reduce(function (acc, word) {
            if (word.includes(keySearch.toLowerCase())) acc.push(currImg)
            return acc;
        }, [])
        return imgs;
    })
    var strHtmls = strHtml.map(function (img) {
        console.log(img)
        if (img.length > 0) return `<img  onclick="onGetMeme(${img[0].id})" class="card-img" src="${img[0].url}">`
    })
    keyWords.forEach((word) => {
        console.log('word', word);
        console.log(keySearch);
        if (word === keySearch.toLowerCase()) {
            updateKeyWords(word);
            renderKeyWord();
        }
    })

    document.querySelector('.gallery-continer').innerHTML = strHtmls.join('')
    console.log(strHtmls);
}
function renderKeyWord() {
    var arrKey = getArrKeyWordForDisplay();
    var keyWords = getKeyWordForDisplay();
    console.log(keyWords);
    var strHtmls = arrKey.map((word) => {
        console.log(keyWords[word])
        return `<p onclick="onChangeKeySize('${word}')" style="font-size:${(1 + (0.1 * keyWords[word]))}rem;">${word}</p>`

    })
    document.querySelector('.key-worlds').innerHTML = strHtmls.join('')

}
function onCanvasClicked(ev) {
    var meme = getMemeForDisplay()
    var { offsetX, offsetY } = ev;
    console.log(offsetX, offsetY)

    var clickedRect = meme.lines.findIndex(line => {
        return offsetX >= line.x - line.size && offsetX <= line.x + line.txt.length * line.size
            && offsetY >= line.y - line.size && offsetY <= line.y + line.size
    })
    var clickedSticker = meme.stickers.findIndex(sticker => {
        return offsetX >= sticker.x && offsetX <= sticker.x + sticker.width
            && offsetY >= sticker.y && offsetY <= sticker.y + sticker.height
    })

    
    if (clickedRect !== -1) {
        updateLineClicked(clickedRect)
        updateStickerClick(-1);
        console.log(clickedRect);

        renderCanvas()
        document.querySelector('input[name="txtLine"]').value = gMeme.lines[gMeme.selectedLineIdx].txt;
    }
    if (clickedSticker !== -1) {
        updateLineClicked(-1)
        updateStickerClick(clickedSticker);
        

    }

}
function onUpLine() {

    upLine();
    renderCanvas();
}


function onDownLine() {

    downLine();
    renderCanvas();
}
function onChangeKeySize(word) {
    onRenderSearchPic(word)
    console.log(word);
    updateKeyWords(word);
    renderKeyWord()

}
function onAddLine() {
    document.querySelector('input[name="txtLine"]').value = '';
    addLine();
}
function onChangeTextSize(diff) {
   var meme=getMemeForDisplay();
   if(meme.selectedStickerIdx!==-1&&meme.selectedLineIdx===-1){
       changeStickerSize(diff)
       renderCanvas();
       return
   }
    changeTextSize(+diff);
    renderCanvas()

}
function onToggleMenu() {

    var flag = document.body.classList.toggle('open-menu');
    if (flag) document.querySelector('.menu-btn').innerText = '✖️'
    else document.querySelector('.menu-btn').innerText = ' ☰'
}

function drawText() {
    const meme = getMemeForDisplay();
   
    meme.lines.forEach(function (line) {
        gCtx.font = `${line.size}px ${line.fontFamily}`;
        gCtx.lineWidth = 1.5;
        gCtx.textAlign = line.align;
        gCtx.strokeStyle = line.strokeStyle
        gCtx.fillStyle = line.color
        // gCtx.fillText(line.txt,(gCelectLine+1)*100,(gCelectLine+1)*100)
        // gCtx.strokeText(line.txt,(gCelectLine+1)*100,(gCelectLine+1)*100)
        gCtx.fillText(line.txt, line.x, line.y)
        gCtx.strokeText(line.txt, line.x, line.y)

    });

}
function onSetTextDirection(dir) {
    setTextalign(dir);
    renderCanvas();
}

function resizeCanvas() {
    var elContainer = document.querySelector('.my-canvas');
    gCanvas.width = elContainer.offsetWidth
    gCanvas.height = elContainer.offsetHeight
}
function onMoveLine() {
    moveLines();
    renderCanvas();
}
function onDeleteLine() {
    deleteLine()
    renderCanvas();
}
function onSetFillColor() {
    var fillStyle = document.querySelector('input[name=colorFill]').value;
    changeFillColor(fillStyle);
    renderCanvas();
}
function onSetStokeColor() {
    var stokeStyle = document.querySelector('input[name=colorStroke]').value;
    changeStokeStyle(stokeStyle)
    renderCanvas();

}
function ondownolad(elLink) {
    downloadCanvas(link)

}
function uploadImg(elForm, ev) {
    ev.preventDefault();
    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-container').innerHTML = `
        <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share   
        </a>`
    }

    doUploadImg(elForm, onSuccess);
}
function onChangeFontSize(font) {
    changeFontFamily(font);
    renderCanvas();
}
function onSaveMemeToStorage() {
    saveMemes(gCanvas);
}
function onHandelMouse(ev) {
    var meme = getMemeForDisplay();
    if (meme.selectedLineIdx === -1 && meme.selectedStickerIdx !== -1) {
        stickerMoving(ev);
        return
    }
    if (ev.type === "mousedown") {
        onCanvasClicked(ev)
        gIsMovingLine = true;
        gCurrX = ev.offsetX
        gCurrY = ev.offsetY
     
    }
    else if (ev.type === "mousemove") {
        if (!gIsMovingLine) return;
        gCurrX = ev.offsetX
        gCurrY = ev.offsetY
        updateGmeme(gCurrX, gCurrY);
        renderCanvas()
    }
    else if (ev.type === "mouseup") {
        gIsMovingLine = false;
    }

}
function stickerMoving(ev) {

    if (ev.type === "mousedown") {
        onCanvasClicked(ev)
        gDrowSticker = true;
        gStickerX = ev.offsetX
        gStickerY = ev.offsetY

    }
    else if (ev.type === "mousemove") {
        if (!gDrowSticker) return;
        gStickerX = ev.offsetX
        gStickerY = ev.offsetY
        updateStickerPos(gStickerX, gStickerY);
        renderCanvas()
    }
    else if (ev.type === "mouseup") {
        gDrowSticker = false;
    }

}