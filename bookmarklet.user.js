// ==UserScript==
// @name         Simplenote Code Mirror Editor
// @namespace    http://simplenote.com/
// @version      1.0
// @description  Applies CodeMirror stylings to the textarea within the simple note app.
// @author       You
// @match        https://app.simplenote.com/
// @grant        none

// @require https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.45.0/codemirror.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.45.0/addon/mode/loadmode.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.45.0/addon/edit/matchbrackets.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.45.0/addon/fold/indent-fold.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.45.0/mode/clike/clike.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.45.0/mode/javascript/javascript.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.45.0/mode/xml/xml.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.45.0/mode/http/http.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.45.0/mode/css/css.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.45.0/mode/sql/sql.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.45.0/mode/vb/vb.min.js

// ==/UserScript==

(function () {
    'use strict';

    function addScriptRef(scriptURL) {
        var script = document.createElement("script");
        script.src = scriptURL;
        document.head.appendChild(script);
    }

    function addStyleRef(cssURL) {
        var ln = document.createElement('link');
        ln.rel = 'stylesheet';
        ln.href = cssURL;
        document.getElementsByTagName('head')[0].appendChild(ln);
    }

    addStyleRef('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.45.0/codemirror.min.css');
    addStyleRef('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.45.0/theme/zenburn.min.css');

    var editor;
    $('.notes').delegate('li', 'click', function (event, ui) {
        editor = CodeMirror.fromTextArea(document.getElementById("txtarea"), {
            lineNumbers: true,
            styleActiveLine: true,
            matchBrackets: true,
            lineWrapping: $('#npLineWrap').prop('checked'),
            mode: '',
            viewportMargin: '50',
            theme: "zenburn"
        });
        $('#npLanguageSelect').val('null');
        $('.CodeMirror').css('font-size', $('#npFontSizeSelect').val() + 'pt');
        $('.CodeMirror').css('font-family', $('#npFontSelect').val());
        $('.CodeMirror').css('height', '100%');
        $('.CodeMirror').css('z-index', 1);
        editor.on('change', function () {
            editor.save();
            $('#txtarea').trigger('keyup');
        });
        editor.refresh();
    }); $('.notes').on('mousedown', function () {
        if (typeof editor !== undefined) {
            editor.toTextArea();
        }
    }); $('.add').on('mousedown', function () {
        editor.toTextArea();
    }); $('.delete').on('mousedown', function () {
        editor.toTextArea();
    }); $('.searchfield').on('click', function () {
        editor.toTextArea();
    }); $('.searchcancel').on('click', function () {
        editor.toTextArea();
    }); $('.wrapper').prepend('<div class="btb"></div>'); $('.btb').append('<select id="npFontSelect" class="npControl"><option value="Calibri">Calibri</option><option value="Consolas" selected="selected">Consolas</option></select>'); $('.btb').append('<select id="npFontSizeSelect" class="npControl"><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option></select>'); $('.btb').append('<select id="npLanguageSelect" class="npControl"><option value="clike">Clike</option><option value="css">CSS</option><option value="text/html">Html</option><option value="javascript">Javascript</option><option value="markdown">Markdown</option><option value="python">Python</option><option value="sql">SQL</option><option value="null" selected="selected">Text</option><option value="vb">VB</option><option value="xml">XML</option></select>'); $('.btb').append('<label id="lblLineWrap" class="npControl" for="npLineWrap">Line Wrap: </label>'); $('.btb').append('<input class="npControl" id="npLineWrap" type="checkbox" checked="true"></input>'); $('.npControl').css('padding', 5); $('.npControl').css('margin', 5); $('#npFontSelect').on('change', function () {
        $('.CodeMirror').css('font-family', $('#npFontSelect').val());
        editor.refresh();
    }); $('#npFontSizeSelect').on('change', function () {
        $('.CodeMirror').css('font-size', $('#npFontSizeSelect').val() + 'pt');
        editor.refresh();
    }); $('#npLanguageSelect').on('change', function () {
        if ($('#npLanguageSelect').val() === 'null') {
            editor.setOption('mode', null);
        } else {
            editor.setOption('mode', $('#npLanguageSelect').val());
        }
    }); $('#npLineWrap').on('change', function () {
        var b;
        if ($('#npLineWrap').prop('checked') === true) {
            editor.setOption('lineWrapping', true);
            editor.refresh();
        } else {
            editor.setOption('lineWrapping', false);
            editor.refresh();
        }
    });

    $(document).keydown(function (e) {
        switch (e.which) {
            case 116:
                e.preventDefault();
                $('#npLanguageSelect').focus();
                break;
            case 119:
                e.preventDefault();
                $('#npLineWrap').trigger('click');
                editor.refresh();
                break;
            case 115:
                e.preventDefault();
                $('.btb').toggle();
                if ($('.btb').is(':visible') === true) {
                    $('.app').css('top', '35px');
                } else {
                    $('.app').css('top', '0px');
                }
                editor.refresh();
                break;
            default:
                //console.log('t');
                // Horrible hack to prevent an error where multiple instances of the editor would continue to exist simultaneously
                if ($('.CodeMirror').length > 1) {
                    $('.CodeMirror')[1].remove();
                }
        }
    }); $('.wrapper').css('bottom', '0px'); $('.footer-right, .footer').css('visibility', 'hidden');

    var searchPaneEnabled = true;

    function toggleSearchPane() {
        if (searchPaneEnabled === true) {
            $('.searchfield').css('width', '0px');
            $('.sidebar').css('width', '0px');
            $('.tagbar').css('padding-left', '0px');
            $('.note').css('left', '0px');
            $('.notes li').css('padding-left', '0px');
            searchPaneEnabled = false;
        } else {
            $('.searchfield').css('width', '260px');
            $('.sidebar').css('width', '360px');
            $('.tagbar').css('padding-left', '65px');
            $('.note').css('left', '361px');
            $('.notes li').css('padding-left', '25px');
            searchPaneEnabled = true;
        }
        editor.refresh();
    }

    $(document).keydown(function (e) {
        if (e.which === 114) {
            toggleSearchPane();
            $(window).trigger('resize');
        }
    });

    $(window).on('resize', function () {
        var windowWidth = $(window).width();
        var sidebarWidth = $('.sidebar').width();
        $('.note').width(windowWidth - sidebarWidth);
        var windowHeight = $(window).height();
        var bookmarkletMenuHeight = $('.btb').height();
        editor.refresh();
    });

})();