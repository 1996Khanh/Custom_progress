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

playBtn.addEventListener("click", function () {
    if (audio.paused) {
        audio.play();
        this.innerHTML = pauseBtnHtml;
    } else {
        audio.pause();
        this.innerHTML = playBtnHtml;
    }
});

var getTime = function (second) {
    if (isNaN(second)) return "00:00";
    var mins = Math.floor(second / 60);
    second = Math.floor(second % 60);
    return `${mins < 10 ? "0" + mins : mins}:${second < 10 ? "0" + second : second}`;
};

audio.addEventListener("loadedmetadata", function () {
    durationEL.innerText = getTime(audio.duration);
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
