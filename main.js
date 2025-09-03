var $ = document.querySelector.bind(document);

var progressBar = $(".progress-bar");
var progress = $(".progress");
var progressSpan = $(".span");
var hoverTimer = $(".hover-timer");

var progressBarWidth = progressBar.clientWidth;
var currentPercent = 0;
var initialClientX = 0;
var isDragging = false;

var audio = $(".audio");
var durationEL = progressBar.nextElementSibling;
var currentTimeEL = progressBar.previousElementSibling;

var playBtn = $(".play-btn");
var currentTime = 0;
var wasPlaying = false;

var pauseBtnHtml = `<i class="fa-solid fa-pause"></i>`;
var playBtnHtml = `<i class="fa-solid fa-play"></i>`;
var getTime = function (second) {
    if (isNaN(second)) return "00:00";
    var mins = Math.floor(second / 60);
    second = Math.floor(second % 60);
    return `${mins < 10 ? "0" + mins : mins}:${second < 10 ? "0" + second : second}`;
};

audio.load();
audio.addEventListener("loadedmetadata", function () {
    durationEL.innerText = getTime(audio.duration);
});

playBtn.addEventListener("click", function () {
    if (audio.paused) {
        audio.play();
        this.innerHTML = pauseBtnHtml;
    } else {
        audio.pause();
        this.innerHTML = playBtnHtml;
    }
});

audio.addEventListener("error", function () {
    console.error("Audio error:", audio.error);
    durationEL.innerText = "00:00";
});

audio.addEventListener("timeupdate", function (e) {
    if (!isDragging) {
        currentTime = audio.currentTime;
        var percent = (currentTime * 100) / audio.duration;
        currentTimeEL.innerText = getTime(currentTime);
        progress.style.width = `${percent}%`;
    }
});

// Cập nhật sự kiện mousedown để hiển thị hover-timer khi kéo
progressBar.addEventListener("mousedown", function (e) {
    if (e.which === 1) {
        isDragging = true;
        wasPlaying = !audio.paused;
        if (wasPlaying) {
            audio.pause();
        }

        var offsetX = e.offsetX;
        var percent = (offsetX * 100) / progressBarWidth;
        percent = +percent.toFixed(2);
        progress.style.width = `${percent}%`;
        if (!isNaN(audio.duration)) {
            audio.currentTime = (percent / 100) * audio.duration;
            currentTimeEL.innerText = getTime(audio.currentTime);
        }

        currentPercent = percent;
        initialClientX = e.clientX;
        document.addEventListener("mousemove", handleDrag);
    }
});

progressSpan.addEventListener("mousedown", function (e) {
    e.stopPropagation();
    if (e.which === 1) {
        isDragging = true;
        wasPlaying = !audio.paused;
        if (wasPlaying) {
            audio.pause();
        }
        initialClientX = e.clientX;
        document.addEventListener("mousemove", handleDrag);
    }
});

document.addEventListener("mouseup", function (e) {
    if (isDragging) {
        isDragging = false;
        document.removeEventListener("mousemove", handleDrag);
        hoverTimer.style.display = "none";

        if (wasPlaying) {
            audio.play();
        }
    }
});

// Cập nhật hàm handleDrag để cập nhật hover-timer khi kéo
var handleDrag = function (e) {
    var moveWidth = ((e.clientX - initialClientX) * 100) / progressBarWidth;
    var percent = Math.max(0, Math.min(100, moveWidth + currentPercent));
    progress.style.width = `${percent}%`;

    if (!isNaN(audio.duration)) {
        var currentDragTime = (percent / 100) * audio.duration;
        audio.currentTime = currentDragTime;
        currentTimeEL.innerText = getTime(currentDragTime);

        // Cập nhật hover-timer theo vị trí chuột
        var offsetX = (percent / 100) * progressBarWidth;
        hoverTimer.textContent = getTime(currentDragTime);
        hoverTimer.style.left = `${offsetX}px`;
        hoverTimer.style.display = "block";
    }
};

// Sự kiện mousemove để hiển thị khi hover (không kéo)
progressBar.addEventListener("mousemove", function (e) {
    if (!isDragging && audio.duration) {
        var offsetX = e.offsetX;
        var percent = (offsetX * 100) / progressBarWidth;
        var hoverTime = (percent / 100) * audio.duration;
        hoverTimer.textContent = getTime(hoverTime);
        hoverTimer.style.left = `${offsetX}px`;
        hoverTimer.style.display = "block";
    }
});

progressBar.addEventListener("mouseleave", function () {
    if (!isDragging) {
        hoverTimer.style.display = "none";
    }
});

window.addEventListener("resize", function () {
    progressBarWidth = progressBar.clientWidth;
});

progressSpan.addEventListener("mousemove", function (e) {
    e.stopPropagation();
});

var karaoke = document.querySelector(".karaoke");
var karaokeInner = document.querySelector(".karaoke-inner");
var closeBtn = karaoke.querySelector(".close");
var karaokePlay = karaoke.querySelector(".play");

var player = document.querySelector(".player");

karaokePlay.addEventListener("click", function () {
    karaokeInner.classList.add("show");
    player.classList.add("showPlay");
});

closeBtn.addEventListener("click", function () {
    karaokeInner.classList.remove("show");
    player.classList.remove("showPlay");
});

// var requestId, currentIndex;

// var karaokeContent = document.querySelector(".karaoke-content");

// var handleKaraoke = function () {
//     var currentTime = audio.currentTime * 1000;

//     handleColor(currentTime); //Xử lý tô màu từng từ khi hát Karaoke

//     var index = lyric.findIndex(function (sentence) {
//         var words = sentence.words;
//         return currentTime >= words[0].startTime && currentTime <= words[words.length - 1].endTime;
//     });

//     if (index !== -1 && index !== currentIndex) {
//         if (index === 0) {
//             var sentenceHtml = `
//        <p>${getSentence(0)}</p>
//        <p>${getSentence(1)}</p>
//        `;
//             karaokeContent.innerHTML = sentenceHtml;
//         } else {
//             //Thực hiện next câu dạng so le
//             setTimeout(function () {
//                 nextSentence(index);
//             }, 500);
//         }

//         currentIndex = index;
//     }

//     requestId = requestAnimationFrame(handleKaraoke);
// };

// var getSentence = function (index) {
//     return lyric[index].words
//         .map(function (word) {
//             return `<span class="word" data-start-time="${word.startTime}" data-end-time="${word.endTime}">${word.data}<span>${word.data}</span></span>`;
//         })
//         .join(" ");
// };

// var nextSentence = function (index) {
//     var sentenceEl = karaokeContent.children;
//     var showSentence = function (lineIndex) {
//         sentenceEl[lineIndex].style.transition = `opacity 0.4s linear`;

//         sentenceEl[lineIndex].style.opacity = 0;

//         setTimeout(function () {
//             sentenceEl[lineIndex].innerHTML = getSentence(index + 1);
//             sentenceEl[lineIndex].style.opacity = 1;
//         }, 350);
//     };
//     if (index % 2 !== 0) {
//         showSentence(0);
//     } else {
//         showSentence(1);
//     }
// };

// var handleColor = function (currentTime) {
//     var wordList = karaokeContent.querySelectorAll(".word");
//     if (wordList.length) {
//         wordList.forEach(function (wordItem, index) {
//             //Lấy startTime, endTime của từng từ trên giao diện
//             var startTime = wordItem.dataset.startTime;
//             var endTime = wordItem.dataset.endTime;

//             if (currentTime > startTime && currentTime < endTime) {
//                 //Tính tỉ lệ phần trăm từ currentTime so với toàn bộ thời gian của 1 từ
//                 var rate = ((currentTime - startTime) / (endTime - startTime)) * 100;

//                 wordItem.children[0].style.width = `${rate}%`;
//             }

//             if (currentTime >= endTime) {
//                 wordItem.children[0].style.width = `100%`;
//             }
//         });
//     }
// };

// audio.addEventListener("play", function () {
//     requestId = requestAnimationFrame(handleKaraoke);
// });

// audio.addEventListener("pause", function () {
//     cancelAnimationFrame(requestId);
// });

var requestId, currentIndex;

var karaokeContent = document.querySelector(".karaoke-content");

console.log(lyric);

var handleKaraoke = function () {
    var currentTime = audio.currentTime * 1000;

    handleColor(currentTime);

    var index = lyric.findIndex(function (sentence) {
        var words = sentence.words;
        return currentTime >= words[0].startTime && currentTime <= words[words.length - 1].endTime;
    });

    if (index !== -1 && index !== currentIndex) {
        if (index === 0) {
            var sentenceHtml = `
            <p>${getSentence(0)}</p>
            <p>${getSentence(1)}</p>
            `;
            karaokeContent.innerHTML = sentenceHtml;
        } else {
            setTimeout(function () {
                nextSentence(index);
            }, 500);
        }
        currentIndex = index;
    }
    requestId = requestAnimationFrame(handleKaraoke);
};

var getSentence = function (index) {
    return lyric[index].words
        .map(function (word) {
            return `<span class="word" data-start-time="${word.startTime}" data-end-time="${word.endTime}">${word.data}<span>${word.data}</span></span>`;
        })
        .join(" ");
};

var nextSentence = function (index) {
    var sentenceEl = karaokeContent.children;
    var showSentence = function (lineIndex) {
        sentenceEl[lineIndex].style.transition = `opacity 0.4s linear`;

        sentenceEl[lineIndex].style.opacity = 0;

        setTimeout(function () {
            sentenceEl[lineIndex].innerHTML = getSentence(index + 1);
            sentenceEl[lineIndex].style.opacity = 1;
        }, 400);
    };

    if (index % 2 !== 0) {
        showSentence(0);
    } else {
        showSentence(1);
    }
};

var handleColor = function (currentTime) {
    var wordList = karaokeContent.querySelectorAll(".word");
    if (wordList.length) {
        wordList.forEach(function (wordItem, index) {
            //Lấy startTime, endTime của từng từ trên giao diện
            var startTime = wordItem.dataset.startTime;
            var endTime = wordItem.dataset.endTime;

            if (currentTime > startTime && currentTime < endTime) {
                //Tính tỉ lệ phần trăm từ currentTime so với toàn bộ thời gian của 1 từ
                var rate = ((currentTime - startTime) / (endTime - startTime)) * 100;

                wordItem.children[0].style.width = `${rate}%`;
            }

            if (currentTime >= endTime) {
                wordItem.children[0].style.overflow = "initial";
            }
        });
    }
};

audio.addEventListener("play", function () {
    requestId = requestAnimationFrame(handleKaraoke);
});

audio.addEventListener("pause", function () {
    cancelAnimationFrame(requestId);
});
