const SHARE_DOMAIN = "https://myfr.org";
const colorPickerDiv = document.getElementById('colorPickerDiv');
const textColorInput = document.getElementById('text-color');

colorPickerDiv.addEventListener('click', function() {
    textColorInput.click();
});

const colorPickerBackground = document.getElementById('colorPickerBackground');
const backgroundColorInput = document.getElementById('text-lines-bg-color');

colorPickerBackground.addEventListener('click', function() {
    backgroundColorInput.click();
});
//end
var urlImageTemporary
var canvas2 // này là canvas gốc nè
var avatarImage; // này là ảnh avatar nè
var currentZoomValue = 0; // giá trị zoom hiện tại
var currentValueRotate = 0; // giá trị rotate hiện tại

var defaultFrameImage; // ảnh frame mặc định này - cái này ảnh frame được pick đầu tiên nếu có 3 ảnh

// VAR - FOR JQUERY
var rotateProgress; // Thanh kéo rotate
var rotateInput; // Giá trị rotate
var uploadPhotoInput;
var waitingTxt;
var iconElement;
var progressBar;
var step1;
var step2;
var step3;
var step4;

var downloadLink;
var saveButton;
var copyText;
var copyIcon;
var btnBack
var btnSave

var image; // biến tạm chưa hình á
var overlayImage;
var jpegDataURL

var downloadImageHd = true
var firstChangeImg = true;
var statusCheckCode = false //check status join code
var checkPreview = false;

var wartermarkImg
var targetSize
var horizontalCenterLine
var verticalCenterLine
var scale
let currentActiveOj




$(document).ready(function() {
    var url = $('#copy-input').val() + '?utm_source=qrcode'
    $('.qr-code').qrcode({
        render: 'canvas',
        text: url,
        width: 125,
        height: 125
    });

    $('.choose-photo').click(function() {
        onChoosePhoto();
    });

    $('#zoomInput').on('input', function() {
        onChangeSize($(this).val());
    });

    $('.reset-size').click(function() {
        onChangeSize(100);
    });

    $('.btn-decrease-size').click(function() {
        decreaseSize();
    });

    $('.btn-increase-size').click(function() {
        increaseSize();
    });

    $('.image-zoom-progress').on('input', function() {
        onChangeSize($(this).val());
    });

    $('.reset-zoom').click(function() {
        onChangeSize(100);
    });

    $('#rotateInput').on('input', function() {
        onRotate($(this).val());
    });

    $('#rolate-left').click(function() {
        rotateLeft();
    });

    $('.size-top pointer').click(function() {
        onRotate(0);
    })

    $('#rotateProgress').on('input', function() {
        onRotate($(this).val());
    })

    $('#rotateProgress').on('change', function() {
        onRotate($(this).val());
    })

    $('#rolate-right').click(function() {
        rotateRight();
    })

    $('#reset-rolate').click(function() {
        onRotate(0);
    })

    $('#btn_preview').click(function() {
        previewImage();
    })

    $('#preview_circle').on({
        mouseenter: function() {
            previewImage();
        },
        mouseleave: function() {
            previewImage();
        }
    });


    $('#btn-addtext').click(function() {
        showFilterImage();
    })

    $('#btn-add-text').click(function() {
        addText()
    })

    $('#btn-filter').click(function() {
        addText();
    })


    //Text

    $(('#text-cmd-bold')).click(function() {
        toggleActiveClass(this);
    })

    $('#text-cmd-italic').click(function() {
        toggleActiveClass(this);
    })

    $('#text-cmd-underline').click(function() {
        toggleActiveClass(this);
    })

    $('#btn-delete-text').click(function() {
        deleteText();
    })

    $('#btn-save-text').click(function() {
        saveText();
    })

    $('.item-filter').click(function() {
        activeFilter(this)
    })

    $('#btn-delete-filter').click(function() {
        deleteFilter();
    })

    $('#btn-save-filter').click(function() {
        saveFilter()
    })

    // Watermark
    $('#wartermark-btn').click(function() {
        toggleWartermark();
    })

    $('#hdImage').click(function() {
        toggleActiveImageHd();
    })

    $('#next-step-3').click(function() {
        changeStep3();
    })

    $('#btn-back-step3').click(function() {
        changeStep2();
    })

    $("#save").click(function() {
        downloadImage();
    })

    $("#download-qr-code").click(function() {
        downloadQRCode();
    })

    $("#button_download_img").click(function() {
        downloadToFile();

    })

    $(document).scrollTop(95);

    handleShareButton()

    $('#submit_join_code').click(function() {
        if ($('#input_join_code').val() != '') checkJoinCode()
    });

    let checkWV = checkWebview();


    $('#webview-detect').show()

    //Declare var for steps
    btnBack = document.getElementById('btn-back-step3');
    btnSave = document.getElementById('save');

    btnBack.style.display = "none"
    btnSave.style.display = "none"

    saveButton = document.getElementById("save");
    // scaleCanvas()
    btn_next = document.getElementById('btn-prev');
    btn_last = document.getElementById('btn-last');

    step1 = document.getElementById('step-1');
    step2 = document.getElementById('step-2');
    step3 = document.getElementById('step-3');
    step4 = document.getElementById('step-4');

    copyText = document.getElementById("copy-input");
    copyIcon = document.getElementById("copy-icon");

    waitingTxt = document.querySelector('.waiting-txt');

    iconElement = document.createElement('i');
    progressBar = document.getElementById('progress_bar_wait_download');
    downloadLink = document.createElement('a');

    groupButtonSystem = document.getElementById("system-button")


    divImageOption = document.getElementById("image-option")
    //For canvas

    editText = document.getElementById('edit-text');

    //For handle upload image

    uploadPhotoInput = document.getElementById('upload_photo');
    uploadPhotoInput.addEventListener('change', handleUploadPhotoInput);
    image = new Image();

    //For setup system

    canvas2 = document.getElementById('le_canvas');

    defaultFrameImage = $('.extra-frames .item').first().find('img');

    rotateProgress = document.getElementById('rotateProgress');
    rotateInput = document.getElementById('rotateInput');

    saveButton.addEventListener("click", handleSaveButtonClick, false);

    setupCanvas();
    canvas2.renderAll();
    canvas2.selection = true;

    canvas2.on('selection:cleared', function() {
        var selectedObject = canvas2.getActiveObject();


        // Kiểm tra xem đối tượng văn bản có được active và có kiểu là 'i-text' hay không
        if (!selectedObject || (selectedObject && selectedObject.type !== 'i-text')) {

            var inputs = editText.querySelectorAll('input');
            var selects = editText.querySelectorAll('select');
            let spans = editText.querySelectorAll('span');

            btn_delete.disabled = true;

            spans.forEach(span => {
                span.classList.add('disabled');
            });

            for (var i = 0; i < inputs.length; i++) {
                inputs[i].disabled = true;
            }

            for (var j = 0; j < selects.length; j++) {
                selects[j].disabled = true;
            }
        }
    });

    canvas2.on('mouse:wheel', (opt) => {
        let activeObject = canvas2.getActiveObject();
        let zoomProgress = document.getElementById('zoomProgress');
        if (activeObject && activeObject.type === 'image') {
            let delta = 0;
            let wheelDelta = opt.e.wheelDelta;
            let deltaY = opt.e.deltaY;
            // CHROME WIN/MAC | SAFARI 7 MAC | OPERA WIN/MAC | EDGE
            if (wheelDelta) {
                delta = -wheelDelta / 120;
            }

            // FIREFOX WIN / MAC | IE
            if (deltaY) {
                deltaY > 0 ? (delta = 1) : (delta = -1);
            }

            let pointer = canvas2.getPointer(opt.e);
            let zoom = activeObject.scaleX - delta / 30; // Sử dụng scaleX để thay đổi tỷ lệ zoom

            // Giới hạn zoom in và zoom out
            if (zoom > 2) zoom = 2;
            if (zoom < 0.1) zoom = 0.1
            // if (zoom < 1) zoom = 1;

            // Đặt điểm zoom là điểm đang được chỉ định
            activeObject.scaleX = activeObject.scaleY = zoom;

            zoomProgress.value = (zoom * 100);
            opt.e.preventDefault();
            opt.e.stopPropagation();

            canvas2.renderAll();

        }
    });

    //Handle text
    btnImageOption = document.getElementById("btn-add-text")
    // btn_delete = document.getElementById("btn-delete-text")

    //Handle zoom on mobile
    // Bắt đầu lắng nghe sự kiện pinch-to-zoom
    let isPinching = false;
    let initialDistance = 0;
    var bbScope = this;
    var hammer = new Hammer.Manager(canvas2.upperCanvasEl);
    var pinch = new Hammer.Pinch();
    var pan = new Hammer.Pan();
    hammer.add([pinch]);
    hammer.add([pan]);

    hammer.on('pinch', function(ev) {
        // Thay vì sử dụng sự kiện "pinch," bạn có thể kiểm tra nếu có đối tượng được chọn
        // và sau đó thực hiện hành động pinch-to-zoom trên đối tượng này.
        var activeObject = canvas2.getActiveObject();
        let zoomProgress = document.getElementById('zoomProgress');
        if (activeObject && isPinching) {

            activeObject.originX = 'center';
            activeObject.originY = 'center';

            activeObject.scaleX = activeObject.scaleY = initialDistance * ev.scale;
            zoomProgress.value = (initialDistance * ev.scale * 100);
            canvas2.renderAll();
        }
    });

    hammer.on('pinchend', function(ev) {
        isPinching = false;

    });

    hammer.on('pinchcancel', function(ev) {
        isPinching = false;
    });

    hammer.on('pinchstart', function(ev) {
        var activeObject = canvas2.getActiveObject();
        if (activeObject) {
            isPinching = true;
            initialDistance = activeObject.scaleX / ev.scale;
        }
    });


    hammer.on('pancancel', function(ev) {
        var isMoving = false;
        canvas2.remove(verticalCenterLine);
        isLine9Added = false;
        canvas2.remove(horizontalCenterLine);
        isLine10Added = false;
    });


    hammer.on('panend', function(ev) {
        var isMoving = false;
        canvas2.remove(verticalCenterLine);
        isLine9Added = false;
        canvas2.remove(horizontalCenterLine);
        isLine10Added = false;
    });

    hammer.on('pandown', function(ev) {
        var isMoving = false;
        canvas2.remove(verticalCenterLine);
        isLine9Added = false;
        canvas2.remove(horizontalCenterLine);
        isLine10Added = false;

    });

    //handle blur object
    var isMoving = false;

    canvas2.on({
        'selection:updated': HandleElement,
        'selection:created': HandleElement,
        'object:moving': function(options) {
            isMoving = true;
            onChange(options);
            onAlignObject(options)

        },
        'object:scaling': onChange,
        'object:rotating': onChange,
        'object:modified': function(options) {
            isMoving = false;
            onChange(options);
        }
    });

    function onChange(options) {

        options.target.setCoords();

        canvas2.forEachObject(function(obj) {
            if (obj === options.target) return;

            if (isMoving || obj === canvas2.getActiveObject()) {
                obj.set('opacity', options.target.intersectsWithObject(obj) ? 0.5 : 1);
            } else {
                obj.set('opacity', 1);
            }
        });
        overlayImage.set('opacity', isMoving ? 0.5 : 1); // Đặt ảnh overlay mờ hoặc trở lại bình thường
    }

    var snapZone = 5;
    var isLine9Added = false;
    var isLine10Added = false;


    function onAlignObject(options) {

        var objectMiddleHorizontal = options.target.left + (options.target.width * options.target.scaleX) /
            2;
        var objectRight = options.target.left + (options.target.width * options.target.scaleX);


        if (options.target.left > canvas2.width / 2 - snapZone &&
            options.target.left < canvas2.width / 2 + snapZone && isMoving) {

            options.target.set({
                left: canvas2.width / 2,
            }).setCoords();

            if (!isLine9Added) {
                canvas2.add(verticalCenterLine);
                isLine9Added = true;
            }
            document.addEventListener("mouseup", () => {
                canvas2.remove(verticalCenterLine);
                isLine9Added = false;
            });

        } else {
            canvas2.remove(verticalCenterLine);
            isLine9Added = false;
        }

        var objectMiddleVertical = options.target.top + (options.target.height * options.target.scaleY) / 2;

        if (options.target.top > canvas2.height / 2 - snapZone &&
            options.target.top < canvas2.height / 2 + snapZone && isMoving) {

            options.target.set({
                top: canvas2.height / 2,
            }).setCoords();

            if (!isLine10Added) {
                canvas2.add(horizontalCenterLine);
                isLine10Added = true
            }


            document.addEventListener("mouseup", () => {
                canvas2.remove(horizontalCenterLine);
                isLine10Added = false
            });

        } else {
            canvas2.remove(horizontalCenterLine);
            isLine10Added = false
        }
    }

    $(".change-frame").click(function() {
        $(".extra-frames .item").removeClass('active');
        $('.img-thumbnail').attr("src", $(this).attr('src'));
        $('.img-thumbnail').show();
        $(this).parent().addClass('active');
        // update current frame in preview box
        currentFrameUrl = $(this).attr('src');
        updateFrameImg(currentFrameUrl);
    })

    //Handle text in canvas
    function HandleElement(obj) {
        var selectedObject = canvas2.getActiveObject();

        // Kiểm tra xem đối tượng văn bản có kiểu là 'i-text' hay không
        if (selectedObject && selectedObject.type === 'i-text') {
            avatarImage.selectable = false;

            $('#filter-image').hide()
            $('#group-edit-image').hide()

            var inputs = editText.querySelectorAll('input');
            var selects = editText.querySelectorAll('select');

            for (var i = 0; i < inputs.length; i++) {
                inputs[i].disabled = false;
            }

            for (var j = 0; j < selects.length; j++) {
                selects[j].disabled = false;
            }

            let spans = editText.querySelectorAll('span');


            spans.forEach(span => {
                span.classList.remove('disabled');
            });

            btn_delete.disabled = false;
            divImageOption.style.display = "none";
            btnImageOption.style.display = "none";
            groupButtonSystem.style.display = "none";
            editText.style.display = "block";
        }
    }

    document.getElementById('text-color').onchange = function() {
        currentActiveOj = activeObject = canvas2.getActiveObject();

        canvas2.getActiveObject().set("fill", this.value);
        canvas2.renderAll(); // Render lại canvas để cập nhật màu sắc

    };

    document.getElementById('text-lines-bg-color').onchange = function() {
        canvas2.getActiveObject().set("textBackgroundColor", this.value);
        canvas2.renderAll();
    };

    document.getElementById('font-family').onchange = function() {
        if (this.value !== 'Times New Roman') {
            loadAndUse(this.value);
        } else {
            canvas2.getActiveObject().set("fontFamily", this.value);
            canvas2.requestRenderAll();
        }
    };

    document.getElementById('text-font-size').onchange = function() {

        canvas2.getActiveObject().set('fontSize', this.value);
        canvas2.renderAll();
    };

    var fontOptions = document.querySelectorAll(".font-option");
    radios5 = document.getElementsByName("fonttype");
    for (var i = 0, max = radios5.length; i < max; i++) {
        radios5[i].onclick = function() {

            if (document.getElementById(this.id).checked == true) {
                if (this.id == "text-cmd-bold") {
                    canvas2.getActiveObject().set("fontWeight", 800);
                }
                if (this.id == "text-cmd-italic") {
                    canvas2.getActiveObject().set("fontStyle", "italic");
                }
                if (this.id == "text-cmd-underline") {
                    canvas2.getActiveObject().set("underline", true);
                }

            } else {
                if (this.id == "text-cmd-bold") {
                    canvas2.getActiveObject().set("fontWeight", "");
                }
                if (this.id == "text-cmd-italic") {
                    canvas2.getActiveObject().set("fontStyle", "");
                }
                if (this.id == "text-cmd-underline") {
                    canvas2.getActiveObject().set("textDecoration", "");
                }
                if (this.id == "text-cmd-linethrough") {
                    canvas2.getActiveObject().set("textDecoration", "");
                }
                if (this.id == "text-cmd-overline") {
                    canvas2.getActiveObject().set("textDecoration", "");
                }
            }

            canvas2.renderAll();
        }
    }

    //End text ---------------------------------------
});
//Function for canvas

function scaleCanvas() {
    targetSize = window.innerWidth - 54

    $(window).on("resize", function() {
        targetSize = window.innerWidth - 54

        if (targetSize > 500) {
            targetSize = 500
        }

        $('.area_process').outerWidth(targetSize - 16);
        $('.area_process').outerHeight(image.height * ((targetSize - 16) / image.width));

        $('.area_frame.common-area').outerWidth(targetSize - 16);
        $('.area_frame.common-area').outerHeight(image.height * ((targetSize - 16) / image.width));

        $('#le_canvas').outerWidth(targetSize - 16)
        $('#le_canvas').outerHeight(image.height * ((targetSize - 16) / image.width));

        $('.canvas-container').outerWidth(targetSize - 16)
        $('.canvas-container').outerHeight(image.height * ((targetSize - 16) / image.width));

        $('.image-editor').outerWidth(targetSize + 16)
        $('.box').outerWidth(targetSize + 16)
    });

    if (targetSize > 500) {
        targetSize = 500
    }

    let padding = 16;
    $('.area_process').outerWidth(targetSize - padding);
    $('.area_frame.common-area').outerWidth(targetSize - padding);
    $('#le_canvas').outerWidth(targetSize - padding)
    $('.canvas-container').outerWidth(targetSize - padding)
    $('.image-editor').outerWidth(targetSize + padding)
    $('.box').outerWidth(targetSize + padding)
    $('.image-editor').show()

    return targetSize - padding
}

function setupCanvas() {

    const defaultFrameImage = $('.item-1 img');

    canvas2 = new fabric.Canvas('le_canvas', {
        selection: false
    });

    canvas2.preserveObjectStacking = true;

    image = new Image();

    image.onload = function() {
        const isMobile = window.innerWidth <= 768; // Kiểm tra nếu màn hình là thiết bị mobile
        const tolerance = -0.01; // Tolerate 1% loss in image size

        targetSize = scaleCanvas() // Kích thước mục tiêu dựa trên loại device
        scale = Math.min(targetSize / image.width);

        const scaledWidth = image.width * scale;
        const scaledHeight = image.height * scale;

        canvas2.setDimensions({
            width: targetSize,
            height: scaledHeight
        });

        const canvasWidth = canvas2.width;
        const canvasHeight = canvas2.height;

        const left = (canvasWidth - scaledWidth) / 2;
        const top = (canvasHeight - scaledHeight) / 2;

        overlayImage = new fabric.Image(image); // Tạo ảnh overlay và gán cho biến overlayImage
        overlayImage.set({
            left: left,
            top: top,
            scaleX: scale,
            scaleY: scale,
            evented: false,
            selectable: false,
        });

        canvas2.add(overlayImage);
        canvas2.selection = false;
        canvas2.renderAll();

        addWatermark()
    };

    image.src = defaultFrameImage.attr('src');
}

function handleSaveButtonClick(e) {
    this.href = canvas2.toDataURL({
        format: "png"
    });

    this.download = "myFrame.png";
}

function toggleActiveImageHd() {
    var button = document.getElementById("hdImage");
    // Kiểm tra xem button có class "active" hay không
    if (button.classList.contains("active")) {

        button.classList.remove("active");
        downloadImageHd = false;
    } else {
        // Nếu không, thêm class "active"
        button.classList.add("active");
        downloadImageHd = true
    }
}

function downloadImage() {
    if (isMobile()) {
        var modalImage = document.querySelector("#exampleModal img");
        modalImage.src = jpegDataURL;
        $('#exampleModal').modal('show');
    } else {
        downloadLink.href = jpegDataURL;
        downloadLink.download = 'myFrame.jpeg'; // Đặt tên file tải về
        downloadLink.click(); // Kích hoạt sự kiện click để tải về hình ảnh JPEG
    }
}

function downloadToFile() {
    if (urlImageTemporary) {
        downloadLink.href = urlImageTemporary;
        downloadLink.download = 'myFrame.jpeg';
        downloadLink.click();
    } else {
        downloadLink.href = jpegDataURL;
        downloadLink.download = 'myFrame.jpeg'; // Đặt tên file tải về
        downloadLink.click(); // Kích hoạt sự kiện click để tải về hình ảnh JPEG
    }
}

function formatImage(imageDataURL) {
    return new Promise((resolve, reject) => {
        var modifiedDataURL = imageDataURL.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
        // Tạo một canvas mới để vẽ lại ảnh PNG
        var canvas3 = document.createElement('canvas');
        var ctx3 = canvas3.getContext('2d');

        var img = new Image();

        img.onload = function() {
            // Đặt kích thước của canvas mới bằng kích thước của hình ảnh
            canvas3.width = img.width;
            canvas3.height = img.height;

            // Vẽ lại ảnh PNG lên canvas mới
            ctx3.drawImage(img, 0, 0);

            // Lấy dữ liệu URL từ canvas mới với định dạng JPEG và chất lượng 90%
            jpegDataURL = canvas3.toDataURL('image/jpeg', 0.9);

            // Trả về dữ liệu URL của ảnh JPEG thông qua resolve của Promise
            resolve(jpegDataURL);
        };

        img.onerror = function(error) {
            reject(error); // Xử lý lỗi nếu có lỗi xảy ra khi tải ảnh
        };

        img.src = modifiedDataURL; // Sử dụng ảnh PNG đã xuất ra từ canvas trước đó
    });
}

// HANDLE TEXT SECTION

function fcopyText() {
    const title = $('#title').text();
    const textToCopy = copyText.value;

    // Thêm đoạn text sau vào nội dung cần sao chép
    const appendedText = textToCopy;
    // "Hello, tớ vừa mới tạo frame " + title.trim() +
    // ", hãy vào link này để thay đổi frame cho avatar của cậu nhé " +
    // Tạo một phần tử input tạm thời để sao chép nội dung mới
    const tempInput = document.createElement("input");
    tempInput.value = appendedText;
    document.body.appendChild(tempInput);
    // Chọn nội dung mới để sao chép
    tempInput.select();

    // Sao chép nội dung mới vào clipboard
    document.execCommand("copy");

    // Loại bỏ phần tử input tạm thời
    document.body.removeChild(tempInput);

    // Thay đổi biểu tượng sau khi sao chép
    copyIcon.className = "fas fa-check";

    // Tạm dừng một khoảng thời gian rồi chuyển trở lại biểu tượng ban đầu
    setTimeout(function() {
        copyIcon.className = "fas fa-copy";
    }, 1000);
}

function loadAndUse(font) {

    var myfont = new FontFaceObserver(font)
    myfont.load()
        .then(function() {
            // when font is loaded, use it.
            canvas2.getActiveObject().set("fontFamily", font);
            canvas2.requestRenderAll();
        }).catch(function(e) {
            alert('font loading failed ' + font);
        });
}

function toggleActiveClass(element) {
    element.classList.toggle("active");

    var isActive = element.classList.contains("active");
    var id = element.id;

    if (id === "text-cmd-bold") {
        if (isActive) {
            canvas2.getActiveObject().set("fontWeight", "bold");

        } else {
            canvas2.getActiveObject().set("fontWeight", "");
        }
        toggleImageSrc("bold-image", "bold.svg", "bold-active.svg");
    } else if (id === "text-cmd-italic") {
        if (isActive) {
            canvas2.getActiveObject().set("fontStyle", "italic");
        } else {
            canvas2.getActiveObject().set("fontStyle", "");
        }

        toggleImageSrc("italic-image", "italic.svg", "italic-active.svg");
    } else if (id === "text-cmd-underline") {
        if (isActive) {
            canvas2.getActiveObject().set("underline", true);

        } else {
            canvas2.getActiveObject().set("underline", false);

        }

        toggleImageSrc("underline-image", "underline.svg", "underline-active.svg");
    }
    canvas2.renderAll()
}

function toggleImageSrc(imageId, currentSrc, newSrc) {
    var imageElement = document.getElementById(imageId);
    if (imageElement) {
        var src = imageElement.src;
        if (src.includes(currentSrc)) {
            imageElement.src = src.replace(currentSrc, newSrc);
        } else {
            imageElement.src = src.replace(newSrc, currentSrc);
        }
    }
}

function addText() {
    var value = 'Edit text here';

    $('#group-edit-image').hide();
    $('#image-option').hide();
    $('#system-button').hide();

    avatarImage.selectable = false;
    divImageOption.style.display = "none";
    btnImageOption.style.display = "none";
    groupButtonSystem.style.display = "none";
    // Tính toán kích thước của canvas
    var canvasWidth = canvas2.width;
    var canvasHeight = canvas2.height;

    // Tạo một đối tượng văn bản
    var text = new fabric.IText(value, {
        left: canvasWidth / 2, // Đặt vị trí trung tâm theo chiều ngang
        top: canvasHeight / 2, // Đặt vị trí trung tâm theo chiều dọc
        textAlign: 'center', // Căn giữa văn bản
        originX: 'center', // Đặt điểm neo theo giữa theo chiều ngang
        originY: 'center', // Đặt điểm neo theo giữa theo chiều dọc
        fill: 'black',
        fontFamily: 'arial black',
        fill: '#000',
        fontSize: 30
    });

    canvas2.forEachObject(function(obj) {

        if (obj === canvas2.getActiveObject()) {
            obj.set('opacity', 0.5);
        } else {

            obj.set('opacity', 0.5);
        }
    });

    overlayImage.set('opacity', 0.5);
    canvas2.add(text);
    canvas2.setActiveObject(text); // Thiết lập đối tượng văn bản là đối tượng đang active
    // Thêm nó vào canvas

    text.set({
        selectable: true, // Cho phép chọn văn bản
        hasControls: true, // Hiển thị các bảng điều khiển (handles) để điều chỉnh kích thước
        hasBorders: true, // Hiển thị các đường viền
        lockScalingX: false, // Cho phép thay đổi kích thước theo chiều ngang
        lockScalingY: false, // Cho phép thay đổi kích thước theo chiều dọc
        lockRotation: false, // Cho phép xoay
        lockMovementX: false, // Cho phép di chuyển theo chiều ngang
        lockMovementY: false, // Cho phép di chuyển theo chiều dọc
        zIndex: 500,
    });

    canvas2.setActiveObject(text);
    canvas2.bringToFront(text)

    // Render lại canvas để hiển thị văn bản
    canvas2.renderAll();
    text.enterEditing();
}

function saveText() {
    avatarImage.selectable = true;
    $('#edit-text').hide()
    $('#group-edit-image').show()
    // editText.style.display = 'none'
    divImageOption.style.display = "block"
    btnImageOption.style.display = "block";
    groupButtonSystem.style.display = "block";


    canvas2.forEachObject(function(obj) {
        if (obj === canvas2.getActiveObject()) {

            obj.set('opacity', 1);
        } else {

            obj.set('opacity', 1);
        }
    });

    overlayImage.set('opacity', 1);
    canvas2.renderAll();
}

function deleteText() {
    avatarImage.selectable = true;

    $('#edit-text').hide()
    $('#group-edit-image').show()
    divImageOption.style.display = "block"
    btnImageOption.style.display = "block";
    groupButtonSystem.style.display = "block";

    var selectedObject = canvas2.getActiveObject();

    if (selectedObject && selectedObject.type === 'i-text') {
        canvas2.remove(selectedObject);
    }


    editText.style.display = 'none'

    canvas2.forEachObject(function(obj) {
        if (obj === canvas2.getActiveObject()) {

            obj.set('opacity', 1);
        } else {

            obj.set('opacity', 1);
        }
    });

    overlayImage.set('opacity', 1);
    canvas2.renderAll();
}

//END TEXT SECTION

function resizeImage(file, maxWidth, maxHeight, callback) {
    let img = new Image();

    img.onload = function() {
        let width = img.width;
        let height = img.height;

        // Kiểm tra và tính toán lại kích thước mới nếu cần
        if (width > maxWidth || height > maxHeight) {
            let ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
        }

        // Tạo một canvas để vẽ lại ảnh mới có kích thước thay đổi
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Chuyển đổi canvas thành file ảnh mới
        canvas.toBlob(function(blob) {
            callback(blob);
        }, file.type || 'image/png');
    };

    // Đọc file ảnh thành URL
    let reader = new FileReader();
    reader.onload = function(event) {
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

//Functions for upload image
function handleUploadPhotoInput(e) {

    if (e.target.files.length > 0) {
        if (avatarImage) {
            canvas2.remove(avatarImage);
            avatarImage = null;
        }

        step1.style.display = 'none';
        step2.style.display = 'block';

        const file = e.target.files[0];
        const reader = new FileReader();

        fabric.filterBackend = new fabric.WebglFilterBackend()
        fabric.isWebglSupported(fabric.textureSize);

        let maxWidth = 2048;
        let maxHeight = 2048;


        reader.onload = function(event) {
            const imgData = event.target.result;

            // Giảm kích thước ảnh
            resizeImage(file, maxWidth, maxHeight, function(resizedFile) {
                const resizedDataURL = URL.createObjectURL(resizedFile);

                // Thêm ảnh đã được giảm kích thước vào canvas sử dụng Fabric.js
                fabric.Image.fromURL(resizedDataURL, function(img) {
                    // Các bước xử lý ảnh sau khi đã giảm kích thước

                    avatarImage = img;
                    // Lấy kích thước của canvas và ảnh
                    var canvasWidth = canvas2.width;
                    var canvasHeight = canvas2.height;

                    img.scaleToWidth(canvas2.getWidth());


                    var imageWidth = canvas2.width;
                    var imageHeight = img.height * img.scaleY;

                    // Đặt vị trí của ảnh vào trung tâm của canvas
                    img.set({
                        left: canvasWidth / 2 - imageWidth / 2,
                        top: canvasHeight / 2 - imageHeight / 2,
                        hasControls: false

                    });

                    avatarImage.left = canvasWidth / 2 - imageWidth / 2,
                        avatarImage.top = canvasHeight / 2 - imageHeight / 2,

                        firstChangeImg = true;

                    canvas2.add(img);
                    canvas2.sendToBack(img);

                    scaleValue = img.scaleY * 100
                    onChangeSize(scaleValue)
                });
            });
        };

        reader.readAsDataURL(file);
    }

    verticalCenterLine = new fabric.Line([
        canvas2.width / 2, 0,
        canvas2.width / 2, canvas2.height
    ], {
        stroke: '#8300ff',
        strokeWidth: 1,
    })

    verticalCenterLine.selectable = false;
    verticalCenterLine.evented = false;

    horizontalCenterLine = new fabric.Line([
        0, canvas2.height / 2,
        canvas2.width, canvas2.height / 2
    ], {
        stroke: '#8300ff',
        strokeWidth: 1,
    })

    horizontalCenterLine.selectable = false;
    horizontalCenterLine.evented = false;
}

function updateFrameImg(currentFrameUrl) {
    overlayImage.setSrc(currentFrameUrl, function() {
        image.width = overlayImage.width
        image.height = overlayImage.height
        const isMobile = window.innerWidth <= 768; // Kiểm tra nếu màn hình là thiết bị mobile
        targetSize = scaleCanvas() // Kích thước mục tiêu dựa trên loại device
        // Tính tỷ lệ co giãn sao cho ảnh sẽ nằm hoàn toàn bên trong canvas
        const scale = Math.min(targetSize / overlayImage.width);
        const scaledWidth = overlayImage.width * scale;
        const scaledHeight = overlayImage.height * scale;

        canvas2.setDimensions({
            width: targetSize,
            height: scaledHeight
        });

        const canvasWidth = canvas2.width;
        const canvasHeight = canvas2.height;
        const left = (canvasWidth - scaledWidth) / 2;
        const top = (canvasHeight - scaledHeight) / 2;

        $('.area_process').height(canvasHeight);
        $('.area_frame').height(canvasHeight);
        $('.overlay').height(canvasHeight);
        // Xóa tất cả các đối tượng trên canvas
        canvas2.clear();

        overlayImage.set({
            left: left,
            top: top,
            scaleX: scale,
            scaleY: scale,
            evented: false,
            selectable: false,
        });

        canvas2.add(overlayImage);
        canvas2.selection = false;

        canvas2.renderAll();
        addWatermark()
    });
}

function onChoosePhoto() {
    // Khi người dùng nhấn vào nút "Chọn hình", kích hoạt sự kiện click trên input type="file"
    var overlay = document.querySelector(".overlay");
    // Kiểm tra xem overlay có tồn tại không
    if (overlay) {
        // Xóa overlay
        overlay.parentNode.removeChild(overlay);
    }
    if ($('#modal-join-code').length && !statusCheckCode) {
        return $('#modal-join-code').modal('show');
    }
    uploadPhotoInput.click();
}
//End --------------------------------


// Functions for change step
function changeStep2() {
    progressValue = 0;
    waitingTxt.textContent = 'Đang xử lý ...';
    waitingTxt.appendChild(iconElement);
    waitingTxt.classList.remove('success');
    iconElement.classList.remove('fa-solid', 'fa-circle-check');
    progressBar.classList.add('progress-bar-animated');
    step3.style.display = 'none'

    btnBack.style.display = "none"
    btnSave.style.display = "none"

    step2.style.display = 'block'

    canvas2.forEachObject(function(obj) {

        obj.selectable = true;
    });
}

function changeStep3() {

    disableCircleOverlay()
    $('#btn_preview .border-main').removeClass('active')

    step2.style.display = 'none'
    step3.style.display = 'block'

    canvas2.forEachObject(function(obj) {
        obj.selectable = false;
    });

    canvas2.discardActiveObject();
    canvas2.renderAll();

    var progressValue = 0;

    // Cập nhật giá trị width của progress-bar mỗi 10ms
    var interval = setInterval(function() {
        // Nếu giá trị progress đã đạt 100%, dừng interval
        if (progressValue >= 100) {
            clearInterval(interval);

            iconElement.classList.add('fa-solid', 'fa-circle-check');
            btnBack.style.display = "block"
            btnSave.style.display = "block"
            // Thêm lớp "success" vào phần tử
            waitingTxt.textContent = 'Hoàn thành';
            waitingTxt.appendChild(iconElement);
            waitingTxt.classList.add('success');

            progressBar.classList.remove('progress-bar-animated');
        } else {
            // Cập nhật giá trị progress và width của progress-bar
            progressValue += 1;
            progressBar.style.width = progressValue + '%';
        }
    }, 10);

    gtag('event', 'DownloadFrame', {
        event_category: 'DownloadFrame',
        event_action: 'ProcessPhoto',
        event_label: 'Xử Lý Ảnh'
    })

    if (downloadImageHd) {
        var imageDataURL = canvas2.toDataURL({
            format: "png",
            multiplier: 4
        });
    } else {
        var imageDataURL = canvas2.toDataURL({
            format: "png",
            multiplier: 2
        });
    }

    var currentPath = window.location.pathname;

    // Tìm vị trí của "e/" trong đường dẫn
    var startIndex = currentPath.indexOf("e/");

    // Trích xuất slug từ đường dẫn bằng cách cắt chuỗi từ vị trí "e/" đến cuối
    var slugVal = currentPath.slice(startIndex + 2);

    const data = {
        slug: slugVal,
    };

    let webview = checkWebview();

    formatImage(imageDataURL)
        .then(jpegDataURL => {
            return dataURLtoBlob(jpegDataURL)

        }).then(function(blob) {
            if (webview) {
                storeTemporaryImage(blob)
            } else {
                $.ajax({
                    type: "POST",
                    url: "/api/notify-download",
                    data: JSON.stringify(data),
                    contentType: "application/json",
                    success: (response) => {
                        if (!response.data == 'SUCCESS') {
                            $('#save').prop('disabled',
                                false); // Sử dụng prop()                                    return;
                        }

                        $('#save').prop('disabled',
                            false); // Sử dụng prop()                            },
                    }
                });
            }
        })
        .catch(error => {
            console.error("Lỗi khi tải ảnh:", error);
        });
}

function showFilterImage() {
    $('#group-edit-image').hide()
    $('#system-button').hide()
    $('#filter-image').show()
}
// End---------------------------

function dataURLtoBlob(dataURL) {
    return new Promise(function(resolve) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            resolve(xhr.response);
        };
        xhr.open('GET', dataURL);
        xhr.responseType = 'blob';
        xhr.send();
    });
}

// Function handle image
function rotateLeft() {
    currentValueRotate -= 10
    onRotate(currentValueRotate);
}

function rotateRight() {
    currentValueRotate += 10
    onRotate(currentValueRotate);
    onRotate(currentValueRotate);
}

function rotateImage(degrees) {
    const activeObject = canvas2.getActiveObject();

    if (avatarImage && avatarImage.type === 'image') {
        const currentAngle = avatarImage.angle || 0;
        // Đặt gốc (origin) của ảnh vào trung tâm của ảnh
        avatarImage.originX = 'center';
        avatarImage.originY = 'center';

        // Đặt góc xoay của ảnh
        avatarImage.angle = degrees;
        currentValueRotate = degrees;

        if (firstChangeImg) {
            const centerX = canvas2.width / 2;
            const centerY = canvas2.height / 2;

            avatarImage.left = centerX;
            avatarImage.top = centerY;
            firstChangeImg = false

        }

        canvas2.renderAll();
        updateRotateValue(avatarImage.angle);
    }
}

function onChangeSize(value) {
    var zoomPercentage = document.getElementById('zoomInput');
    var zoomProgress = document.getElementById('zoomProgress');

    if (value < 10 || value > 200) {
        // Đổi màu border-color của ô input thành đỏ
        zoomPercentage.style.borderColor = 'red';
        value = currentZoomValue;
    } else {
        // Nếu giá trị hợp lệ, trả lại màu border-color mặc định
        zoomPercentage.style.borderColor = '';
    }

    // Cập nhật giá trị percent
    zoomPercentage.textContent = value;
    // Đặt giá trị mới cho input và progress bar
    zoomPercentage.value = value;
    zoomProgress.value = value;
    // Lưu giá trị hiện tại cho lần sau
    currentZoomValue = value;
    // Đảm bảo rằng ảnh được tâm trung tâm sau khi thay đổi kích thước
    if (avatarImage && avatarImage.type === 'image') {
        avatarImage.originX = 'center';
        avatarImage.originY = 'center';
        if (firstChangeImg) {
            const centerX = canvas2.width / 2;
            const centerY = canvas2.height / 2;

            avatarImage.left = centerX;
            avatarImage.top = centerY;
            firstChangeImg = false
        }

        var scaleValue = value / 100;
        avatarImage.scaleX = scaleValue;
        avatarImage.scaleY = scaleValue;
    }

    canvas2.renderAll();
}
// Hàm cập nhật giá trị góc xoay trên giao diện
function updateRotateValue(angle) {
    rotateInput.textContent = angle + '°';
}

function onRotate(value) {
    if (value > 180) {
        value = currentValueRotate = -170
    }
    if (value < -180) {
        value = currentValueRotate = 170
    }

    const numericValue = parseInt(value);
    rotateImage(numericValue);

    rotateProgress.value = value
    rotateInput.value = value
}

function increaseSize() {
    var zoomPercentage = document.getElementById('zoomInput');
    var zoomProgress = document.getElementById('zoomProgress');
    var value = parseInt(zoomPercentage.value)
    value += 10
    // Kiểm tra nếu giá trị nằm ngoài khoảng từ 50 đến 200
    if (value < 10) {
        value = 10
    }
    if (value > 200) {
        value = 200
    } else {
        // Nếu giá trị hợp lệ, trả lại màu border-color mặc định
        zoomPercentage.style.borderColor = '';
    }
    onChangeSize(value)
}

function decreaseSize() {
    var zoomPercentage = document.getElementById('zoomInput');
    var zoomProgress = document.getElementById('zoomProgress');

    var value = parseInt(zoomPercentage.value)
    value -= 10
    // Kiểm tra nếu giá trị nằm ngoài khoảng từ 50 đến 200
    if (value < 10) {
        value = 10
    }
    if (value > 200) {
        value = 200

    } else {
        // Nếu giá trị hợp lệ, trả lại màu border-color mặc định
        zoomPercentage.style.borderColor = '';
    }

    onChangeSize(value)
}

//End

//Orther
function isMobile() {
    return window.innerWidth <= 768;
}

function HandleShare() {
    var $el = $(".share"),
        $plus = $el.find(".plus"),
        $header = $el.find(".share__header"),
        $content = $el.find(".share__content"),
        $contentitem = $el.find(".item");
    togglestatus = false;

    $plus.on("click", reveal);

    function reveal() {
        togglestatus = !togglestatus;
        if (togglestatus) {
            var heightVal = parseInt($el.css("height")) + $content.outerHeight() + 30;
            $plus.addClass("rotate");
            $(".item").each(function(index) {
                var elem = this;
                (function(i, elem) {
                    setTimeout(function() {
                        $(elem).addClass("reveal");
                    }, i * 150);
                })(index, elem);
            });

            $header.addClass("active");
            $el.css("height", heightVal + "px");
        } else {
            $header.removeClass("active");
            $(".item").removeClass("reveal");
            $plus.removeClass("rotate");
            $el.css("height", "47px");
        }
    }
};


function addWatermark() {
    sourceWatermarkImg = new Image();

    sourceWatermarkImg.onload = function() {
        wartermarkImg = new fabric.Image(sourceWatermarkImg); // Tạo ảnh overlay và gán cho biến overlayImage

        const canvasWidth = canvas2.width;
        const canvasHeight = canvas2.height;

        // Tính tỷ lệ co giãn sao cho ảnh sẽ nằm hoàn toàn bên trong canvas
        const scaledWidth = wartermarkImg.width;
        const scaledHeight = wartermarkImg.height;
        const left = canvasWidth - scaledWidth + 20;
        const top = canvasHeight - scaledHeight + 25;

        wartermarkImg.set({
            right: left,
            top: top,
            evented: false,
            selectable: false,
        });

        canvas2.setOverlayImage(wartermarkImg, canvas2.renderAll.bind(canvas2), {
            left: left,
            top: top,
            evented: false,
            selectable: false,
        });

        canvas2.renderAll()
    }
    sourceWatermarkImg.src = $('#watermark').attr('src')
}

function toggleWartermark() {
    let button = document.getElementById("wartermark-btn");

    if (button.classList.contains("active")) {
        button.classList.remove("active");
        wartermarkImg.set('opacity', 1)
        canvas2.renderAll()
    } else {
        button.classList.add("active");
        wartermarkImg.set('opacity', 0)
        canvas2.renderAll()
    }
}
//End------------------------------------------

//Filter image
let clicked = true;
function activeFilter(obj) {

    if (clicked) {
        clicked = false
        if (fabric.isWebglSupported()) {
            fabric.textureSize = fabric.maxTextureSize;
        }
        avatarImage.filters = [];
        avatarImage.applyFilters();
        canvas2.renderAll();

        $(".slider-filter .item").removeClass('active');
        var valFilter = $(obj).find('img').attr('data-filter');
        chooseFilter(valFilter)

        $(obj).parent().addClass('active');

        avatarImage.applyFilters();
        canvas2.renderAll();
        clicked = true
    }


}

function chooseFilter(filter) {

    switch (filter) {

        case 'polaroid':
            /* Polaroid effect */
            var pl = new fabric.Image.filters.Polaroid();
            avatarImage.filters.push(pl);
            return;
        case 'sepia':
            /* Sepia effect */
            var sp = new fabric.Image.filters.Sepia();
            avatarImage.filters.push(sp);
            return;
        case 'kodachrome':
            /* Kodachrome effect */
            var kd = new fabric.Image.filters.Kodachrome();
            avatarImage.filters.push(kd);
            return;
        case 'contrast':
            /* Contrast filter */
            var contrast = new fabric.Image.filters.Contrast({
                contrast: 0.3
            });
            avatarImage.filters.push(contrast);
            return;
        case 'brightness':
            /* Brightness filter */
            var brightness = new fabric.Image.filters.Brightness({
                brightness: 0.8
            });
            avatarImage.filters.push(brightness);
            return;

        case 'greyscale':
            /* Greyscale */
            var gs = new fabric.Image.filters.Grayscale();
            avatarImage.filters.push(gs);
            return;
        case 'brownie':
            /* Brownie */
            var br = new fabric.Image.filters.Brownie();
            avatarImage.filters.push(br);
            return;
        case 'vintage':
            /* Vintage */
            var vn = new fabric.Image.filters.Vintage();
            avatarImage.filters.push(vn);
            return;
        case 'technicolor':
            /* Technicolor */
            var tc = new fabric.Image.filters.Technicolor();
            avatarImage.filters.push(tc);
            return;
        case 'pixelate':
            /* Pixelate */
            var px = new fabric.Image.filters.Pixelate();
            avatarImage.filters.push(px);
            return;

        case 'invert':
            /* Invert */
            var inv = new fabric.Image.filters.Invert();
            avatarImage.filters.push(inv);
            return;
        case 'blur':
            /* Blur */
            var blr = new fabric.Image.filters.Blur();
            avatarImage.filters.push(blr);
            return;
        case 'sharpen':
            /* Sharpen */
            var sharpen = new fabric.Image.filters.Convolute({
                matrix: [0, -1, 0,
                    -1, 5, -1,
                    0, -1, 0
                ]
            });
            avatarImage.filters.push(sharpen);
            return;
        case 'emboss':
            /* Emboss */
            var emb = new fabric.Image.filters.Convolute({
                matrix: [1, 1, 1,
                    1, 0.7, -1,
                    -1, -1, -1
                ]
            });
            avatarImage.filters.push(emb);
            return;

        case 'removeColor':
            /* Remove color */
            var rm = new fabric.Image.filters.RemoveColor({
                threshold: 0.2,
                distance: 0.5
            });
            avatarImage.filters.push(rm);
            return;
        case 'blacknWhite':
            /* Black and White */
            var bw = new fabric.Image.filters.BlackWhite();
            avatarImage.filters.push(bw);
            return;
        case 'vibrance':
            /* Vibrance filter */
            var vb = new fabric.Image.filters.Vibrance({
                vibrance: 1
            });
            avatarImage.filters.push(vb);
            return;

        case 'blendColor':
            /* Blend color */
            var blcol = new fabric.Image.filters.BlendColor({
                color: '#00ff00',
                mode: 'multiply'
            });
            avatarImage.filters.push(blcol);
            return;
        case 'blendImage':
            /* Blend image */
            var blimg = new fabric.Image.filters.BlendImage({
                image: secImg,
                mode: 'multiply',
                alpha: 0.2
            });
            avatarImage.filters.push(blimg);
            return;

        case 'hueRotate':
            /* Hue rotate */
            var huerot = new fabric.Image.filters.HueRotation({
                rotation: 0.5
            });
            avatarImage.filters.push(huerot);
            return;
        case 'saturation':
            /* Saturation */
            var sat = new fabric.Image.filters.Saturation({
                saturation: 0.7
            });
            avatarImage.filters.push(sat);
            return;
        case 'gamma':
            /* Gamma filter */
            var gamma = new fabric.Image.filters.Gamma({
                gamma: [1, 0.5, 2.1]
            });
            avatarImage.filters.push(gamma);
            return;
        default:
            avatarImage.filters = [];

    }
}

function deleteFilter() {
    avatarImage.filters = [];
    avatarImage.applyFilters();
    canvas2.renderAll();

    $('#group-edit-image').show()
    $('#filter-image').hide()
    $('#system-button').show()
}

function saveFilter() {
    $('#group-edit-image').show()
    $('#filter-image').hide()
    $('#system-button').show()
}

function checkWebview() {
    isWebview = false;
    var standalone = window.navigator.standalone,
        userAgent = window.navigator.userAgent.toLowerCase(),
        safari = /safari/.test(userAgent),
        ios = /iphone|ipod|ipad/.test(userAgent);

    if (ios) {
        if (!standalone && safari) {
            console.log('Safari');
        } else if (!standalone && !safari) {
            isWebview = false
        };
    } else {
        if (userAgent.includes('wv')) {
            isWebview = true
        } else {
            console.log('chrome');
        }
    };

    return isWebview;
};

function redirectToBrowser() {
    let currentUrl = window.location.href
    window.location = 'intent:' + currentUrl + '#Intent;end';
    // window.open(currentUrl, '_system');
}

//END---------------------------------------------

function downloadQRCode() {
    const newCanvas = $('.qr-code canvas').get(0);
    const context = newCanvas.getContext('2d');

    var image = new Image();
    image.src = newCanvas.toDataURL('image/png');

    image.onload = function() {
        context.drawImage(image, 0, 0);
        var downloadLink = document.createElement('a');
        downloadLink.href = newCanvas.toDataURL('image/png');
        downloadLink.download = `qr-code-${event.slug}.png`;
        downloadLink.click();
    };
}

function checkJoinCode() {
    let urlCheckCode = window.location.origin + '/api/check-join-code';
    let join_code = $('#input_join_code').val();
    let data = {
        event_id: eventID,
        join_code: join_code,
        _token: csrfToken
    };

    blockUI();
    $.post(urlCheckCode, data, function(res) {
        statusCheckCode = true;
        $('#modal-join-code').modal('hide');
        onChoosePhoto();
    }).fail(function(xhr, status, error) {
        notification.show('Mã tham gia không đúng! Vui lòng kiểm tra lại.', 'danger');
    }).always(function() {
        $.unblockUI();
    });

}

function handleShareButton() {
    let url = $("#copy-input").val();
    let title = $('#title').text();

    title = title.trim()

    $('#share_facebook').click(function() {
        this.href = `https://www.facebook.com/share.php?u=${url}`
    });

    $('#share_email').click(function() {
        this.href =
            `mailto:?subject=Hưởng ứng chiến dịch&amp;&body=Hello, tớ vừa mới tạo frame ${title}, hãy vào link này để thay đổi frame cho avatar của cậu nhé ${url}`
    });
}

function previewImage() {
    if (!checkPreview) {
        let maxRadius = canvas2.width > canvas2.height ? canvas2.height / 2 : canvas2.width / 2;
        var mask = new fabric.Circle({
            radius: maxRadius, // Bán kính của mask hình tròn
            left: canvas2.width / 2, // Vị trí X của mask
            top: canvas2.height / 2, // Vị trí Y của mask
            originX: 'center',
            originY: 'center',
            selectable: false,
            evented: false,
            fill: 'rgba(0, 0, 0, 0.4)', // Màu fill trong suốt
            strokeWidth: 0, // Không có đường viền
        });
        // type = 'avatar'
        canvas2.clipPath = mask; // Áp dụng mask để cắt ảnh
        // canvas2.backgroundColor = 'rgba(0, 0, 0, 0)';
        canvas2.renderAll();
        checkPreview = true

    } else {
        canvas2.clipPath = null; // Loại bỏ mask
        canvas2.backgroundColor = 'rgba(0, 0, 0, 0)'; // Đặt màu nền trong suốt
        canvas2.renderAll();
        checkPreview = false;
    }

    $('#btn_preview .border-main').toggleClass('active')

}

function disableCircleOverlay() {
    if (checkPreview) {
        canvas2.clipPath = null; // Loại bỏ mask
        canvas2.backgroundColor = 'rgba(0, 0, 0, 0)'; // Đặt màu nền trong suốt
        canvas2.renderAll();
        checkPreview = false;
    }

}

function storeTemporaryImage(blob) {
    var currentPath = window.location.pathname;
    // Tìm vị trí của "e/" trong đường dẫn
    var startIndex = currentPath.indexOf("e/");
    // Trích xuất slug từ đường dẫn bằng cách cắt chuỗi từ vị trí "e/" đến cuối
    var slugEvent = currentPath.slice(startIndex + 2);

    let uuid = $('#uuid').val()

    let formData = new FormData();

    formData.append('uuid', uuid);
    formData.append('file', blob);
    formData.append('slug', slugEvent);

    // Thêm các trường dữ liệu khác nếu cần
    formData.append('token', csrfToken);

    $.ajax({
        type: "POST",
        url: "/api/store-temporary",
        data: formData,
        processData: false,
        contentType: false,
        success: (response) => {
            urlImageTemporary = response.data
        },
    });
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    var domain = window.location.hostname;
    if (domain.includes("irace.vn")) domain = "irace.vn";
    document.cookie = name + "=" + (value || "") + expires + ";domain=." + domain + ";path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = "".concat(name, "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;");
}
