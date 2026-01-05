$(document).ready(function(){

window.scrollTo(0,0);

$("img.lazyload").lazyload({
	placeholder : g5_url+"/img/ajaxLoader.gif"
});

var sectViewWidth = $("#sectView").width();
$("img.sect-photo").each(function(){
var photoWidth = $(this).width();
	if(photoWidth>=sectViewWidth)
		$(this).css("width","100%");
	else
		$(this).css("width",photoWidth+"px");
});

if(!g5_is_mobile) {
var sectSubH = $("#sect-sub").height();
var sectMainH = $("#sect-main").height();
if(sectMainH<sectSubH) $("#sect-main").css("height",sectSubH+"px");
}
$("textarea.tx-wr-content").jqte();

	var cur_width = $(window).width();
	if(cur_width<535) {
		$("#m-user-icon").show();
		$("#circle-arrow").removeClass("circle-arrow1").addClass("circle-arrow2");
	} else {
		$("#m-user-icon").hide();
		$("#circle-arrow").removeClass("circle-arrow2").addClass("circle-arrow1");
	}
	if(cur_width<752) {
		$("#sect-sub").removeClass("sect-subAbs").addClass("sect-subClbo");
		$("#sect-subMain").removeClass("sect-subFix").addClass("sect-subClbo");
		$("#commentsBox").css("margin-top","20px");
		$("#userBox").removeClass('abs').addClass('clBo');
		$("#writeName li").addClass('floL55');
		$("#sendMemo,#moreWrInfo").removeClass('btn-xs');
		$(".photoInfo").addClass("dispN");
	} else {
		$("#sect-sub").removeClass("sect-subClbo").addClass("sect-subAbs");
		$("#sect-subMain").removeClass("sect-subClbo").addClass("sect-subFix");
		$("#commentsBox").css("margin-top","0");
		$("#userBox").removeClass('clBo').addClass('abs');
		$("#writeName li").removeClass('floL55');
		$("#sendMemo,#moreWrInfo").addClass('btn-xs');
		$(".photoInfo").removeClass("dispN");
	}

			var sectMainWidth = $("#sect-main").width();
			var mainSubWidth = $("#mainSub").width();
			var mSList = sectMainWidth - mainSubWidth;
			$(".mSList,#mainTop").width(mSList);
			var mainSubRW = $("#mainSubR").width();
			var mainSubLW = mainSubWidth - mainSubRW - 15;
			var mainSquareHeight = $("#mainSquare").height();
			var mainSubHeight = $("#mainSub").height();
			if(mainSquareHeight>mainSubHeight) $("#mainSub").height(mainSquareHeight);
			if(mainSubHeight>mainSquareHeight) $("#mainSquare").height(mainSubHeight);
			var mainSubLH = $("#mainSubL").height();
			var mainSubRH = $("#mainSubR").height();
			if(mainSubLH>mainSubRH) $("#mainSubR").height(mainSubLH);
			if(mainSubRH>mainSubLH) $("#mainSubL").height(mainSubRH);
		if(cur_width<950) {
			$("#mainSub").removeClass('mainSubAbs').addClass('mainSubClbo');
			$("#mainSquare,.mSList,#mainTop,#mainSub").css("width","100%");
			$("#mainSquare,#mainSub").height('');
			$("#mainSubR").addClass('dispN').css('width','0px');
			$("#mainSubL").css("width","100%");
			$("#mdCom").removeClass('mdComFixed').addClass('mdComClbo');
			$("#mdCon").css({"margin-right":"0","padding":"5px"});
			$("#sqCate").removeClass('sqCateFixed').addClass('sqCateClbo');
			$("#sqCon").css({"margin-right":"0","padding":"5px"});
			$("#sqCateListWrap").removeClass('sqCateListWrapFixed1').addClass('sqCateListWrapFixed2');
		} else if(cur_width<1015) {
			$("#mainSub").removeClass('mainSubClbo').addClass('mainSubAbs');
			$("#mainSub").css("width","240px");
			$(".mSList,#mainTop").width(mSList);
			$("#mainSubR").addClass('dispN').css('width','0px');
			$("#mainSubL").width(mainSubLW);
			$("#mdCom").removeClass('mdComClbo').addClass('mdComFixed');
			$("#mdCon").css({"margin-right":"330px","padding":"15px 0 15px 15px;"});
			$("#sqCate").removeClass('sqCateClbo').addClass('sqCateFixed');
			$("#sqCon").css({"margin-right":"260px","padding":"15px 0 15px 5px;"});
			$("#sqCateListWrap").removeClass('sqCateListWrapFixed2').addClass('sqCateListWrapFixed1');
		} else if(cur_width<1095) {
			$("#mainSub,#mainSubR").css("width","320px");
			$(".mSList,#mainTop").width(mSList);
			$("#mainSubR").addClass('dispN').css('width','0px');
			$("#mainSubL").width(mainSubLW);
		} else if(cur_width<1255) {
			$("#mainSub").css("width","400px");
			$(".mSList,#mainTop").width(mSList);
			$("#mainSubR").removeClass('dispN').css('width','200px');
			$("#mainSubL").width(mainSubLW);
		} else if(cur_width>=1255) {
			$("#mainSub").css("width","560px");
			$(".mSList,#mainTop").width(mSList);
			$("#mainSubR").removeClass('dispN').css('width','200px');
			$("#mainSubL").width(mainSubLW);
		}
	
	$(window).resize(function(){
		var cur_width = $(window).width();
		if(cur_width<535) {
			$("#m-user-icon").show();
			$("#circle-arrow").removeClass("circle-arrow1").addClass("circle-arrow2");
		} else {
			$("#m-user-icon").hide();
			$("#circle-arrow").removeClass("circle-arrow2").addClass("circle-arrow1");
		}
		if(cur_width<752) {
			$("#sect-sub").removeClass("sect-subAbs").addClass("sect-subClbo");
			$("#sect-subMain").removeClass("sect-subFix").addClass("sect-subClbo");
			$("#userBox").removeClass('abs').addClass('clBo');
			$("#writeName li").addClass('floL55');
			$("#sendMemo,#moreWrInfo").removeClass('btn-xs');
			$(".photoInfo").addClass("dispN");
//			$("#mdCom").removeClass('mdComFixed').addClass('mdComClbo');
		} else {
			$("#sect-sub").removeClass("sect-subClbo").addClass("sect-subAbs");
			$("#sect-subMain").removeClass("sect-subClbo").addClass("sect-subFix");
			$("#userBox").removeClass('clBo').addClass('abs');
			$("#writeName li").removeClass('floL55');
			$("#sendMemo,#moreWrInfo").addClass('btn-xs');
			$(".photoInfo").removeClass("dispN");
//			$("#mdCom").removeClass('mdComClbo').addClass('mdComFixed');
		}

			var sectMainWidth = $("#sect-main").width();
			var mainSubWidth = $("#mainSub").width();
			var mSList = sectMainWidth - mainSubWidth;
			$(".mSList,#mainTop").width(mSList);
			var mainSubRW = $("#mainSubR").width();
			var mainSubLW = mainSubWidth - mainSubRW - 15;
			var mainSquareHeight = $("#mainSquare").height();
			var mainSubHeight = $("#mainSub").height();
			if(mainSquareHeight>mainSubHeight) $("#mainSub").height(mainSquareHeight);
			if(mainSubHeight>mainSquareHeight) $("#mainSquare").height(mainSubHeight);
			var mainSubLH = $("#mainSubL").height();
			var mainSubRH = $("#mainSubR").height();
			if(mainSubLH>mainSubRH) $("#mainSubR").height(mainSubLH);
			if(mainSubRH>mainSubLH) $("#mainSubL").height(mainSubRH);
		if(cur_width<950) {
			$("#mainSub").removeClass('mainSubAbs').addClass('mainSubClbo');
			$("#mainSquare,.mSList,#mainTop,#mainSub").css("width","100%");
			$("#mainSquare,#mainSub").height('');
			$("#mainSubR").addClass('dispN').css('width','0px');
			$("#mainSubL").css("width","100%");
			$("#mdCom").removeClass('mdComFixed').addClass('mdComClbo');
			$("#mdCon").css({"margin-right":"0","padding":"5px"});
		} else if(cur_width<1015) {
			$("#mainSub").removeClass('mainSubClbo').addClass('mainSubAbs');
			$("#mainSub").css("width","240px");
			$(".mSList,#mainTop").width(mSList);
			$("#mainSubR").addClass('dispN').css('width','0px');
			$("#mainSubL").width(mainSubLW);
			$("#mdCom").removeClass('mdComClbo').addClass('mdComFixed');
			$("#mdCon").css({"margin-right":"330px","padding":"15px 0 15px 15px;"});
		} else if(cur_width<1095) {
			$("#mainSub").css("width","320px");
			$(".mSList,#mainTop").width(mSList);
			$("#mainSubR").addClass('dispN').css('width','0px');
			$("#mainSubL").width(mainSubLW);
		} else if(cur_width<1255) {
			$("#mainSub").css("width","400px");
			$(".mSList,#mainTop").width(mSList);
			$("#mainSubR").removeClass('dispN').css('width','200px');
			$("#mainSubL").width(mainSubLW);			
		} else if(cur_width>=1255) {
			$("#mainSub").css("width","560px");
			$(".mSList,#mainTop").width(mSList);
			$("#mainSubR").removeClass('dispN').css('width','200px');
			$("#mainSubL").width(mainSubLW);
		}

		var sectViewWidth = $("#sectView").width();
		$.post(g5_url+"/json_do.php",{
			action : 'upIPnSectViewWidth',
			sVW : sectViewWidth,
			addr : addr
		},function(data){
			if(data!='') {}
		});
//		var msListW = $(".mSList").width();
//		$(".text").text(mainSubRW);
	});

	var sectMainWidth = $("#sect-main").width();
	$.post(g5_url+"/json_do.php",{
		action : 'upIPnSectViewWidth',
		sVW : sectMainWidth,
		addr : addr
	},function(data){
		if(data!='') {}
	});

    $('#circle-arrow').toggle(
		function() {
		$('#toggle-menu-box').animate({marginLeft:'+=330px'},500);
		$('.circle-arrow1').animate({marginLeft:'+=250px'},500);
		$('.circle-arrow2').animate({marginLeft:'+=300px'},500);
		$('.circle-arrow').removeClass('fa-chevron-circle-right').addClass('fa-chevron-circle-left');
    },
		function() {
		$('#toggle-menu-box').animate({marginLeft:'-=330px'},500);
		$('.circle-arrow1').animate({marginLeft:'-=250px'},500);
		$('.circle-arrow2').animate({marginLeft:'-=300px'},500);
		$('.circle-arrow').removeClass('fa-chevron-circle-left').addClass('fa-chevron-circle-right');
    });
	
	$('#m-user-icon,#openLogin').click(function() {
		$('#navL-menu li#li-user').click();
	});
	$("#openReg").toggle(
		function(){
			$("#loginBox").slideUp();
			$("#regBox").slideDown();
			$(this).html('<i class="fa fa-info-circle"></i> 회원이시면 여기서 로그인을 하세요.<i class="fa fa-hand-o-up"></i>');
		},
		function(){
			$("#regBox").slideUp();
			$("#loginBox").slideDown();
			$(this).html('<i class="fa fa-info-circle"></i> 회원이 아니시면 여기서 회원가입을 하세요.<i class="fa fa-hand-o-down"></i>');
		}
	);
	$("#btn-mdInfoBox").click(function(){
		$("#mbInfoBox").slideUp();
		$("#mdInfoBox").slideDown();
	});
	$("#btn-undo").click(function(){
		$("#mdInfoBox").slideUp();
		$("#mbInfoBox").slideDown();
	});
	$("#btnMngCa").click(function(){
		$("#mbInfoBox").slideUp();
		$("#mngCaBox").slideDown();
	});
	$("#btnMngCaClose").click(function(){
		$("#mngCaBox").slideUp();
		$("#mbInfoBox").slideDown();
	});
	$("#btnMngCaOpen,#mngCate").click(function(){
		$('#navL-menu li#li-user').click();
		$("#btnMngCa").click();
	});
/***/
$("#btnUpCa").click(function(){
	var caListVal = $("#caList").val();
	$.getJSON(g5_url+"/json_do.php",{
		action : 'btnUpCa',
		caList : caListVal
	},function(json) {
		if(json.cateInfo.length>0) {
			$.each(json.cateInfo, function() {
				alert('카테고리가 수정되었습니다.');
				$("textarea#caList").val(this['cateList']);
				$("td#cateListBox").html('').append([
					'<span class="Ccrimson">카테고리가 수정되었습니다.</span><br />',
					this['cateString']
				].join(''));
			});
		} else {}
	});
});

//$("#simpleComment").bind("change keyup input",function(){
$("#simpleComment").keyup(function(){
	var texts = $(this).val();
	var texts = texts.replace("  "," ");//공백 2개를 1개로
	$(this).val(texts);
	var textsLen = texts.length;
	var txt = textsLen+'자';
	if(textsLen==0) txt = '';
	$("#txtNum").text(txt);
	if(textsLen>=20) $("button#btnSimpleComment").fadeIn();
	else $("button#btnSimpleComment").fadeOut();
});
$("#btnSimpleComment").click(function(){
	var wrContent = $("#simpleComment.sC").val();
	var wrContent = $.trim(wrContent);
	var w = $("input#w.sC").val();
	var boTable = $("input#bo_table.sC").val();
	var sca = $("input#sca.sC").val();
	var wrSubject = wrContent.substr(0,60);
	$.post(g5_bbs_url+"/write_update.php",{
		mode : 'ajaxSimpleComment',
		wr_subject : wrSubject,
		wr_content : wrContent,
		w : w,
		bo_table : boTable,
		ca_name : sca
	},function(data){
		if(data!='') {
//			$("#simpleCommentList").html('').append(data);
			$("#madangList").html('').append(data);
			$("#btnSimpleComment").fadeOut();
			$("#simpleComment.sC").val('');
			$("#txtNum").text('');
		}
	});
});
$("#mainSubL li").hover(
	function(){
		var id = $(this).attr('id');
		$("li#"+id).addClass('this');
	},
	function(){
		var id = $(this).attr('id');
		$("li#"+id).removeClass('this');
	}
);
$("#simpleCommentList").on("mouseenter","li",
	function(){
		var id = $(this).attr('id');
		$("div#"+id+".toolBox").show();
		$("li#"+id).addClass('this');
	}
);
$("#simpleCommentList").on("mouseleave","li",
	function(){
		var id = $(this).attr('id');
		$("#simpleCommentList li .toolBox").hide();
		$("#simpleCommentList li").removeClass('this');
	}
);

	// 별명 검사
//$("#reg_mb_nick").keyup(function(){
$("#reg_mb_nick").bind("change keyup input",function(){
	var regMbNickVal = $("#reg_mb_nick").val();
//	var mbNickDefaultVal = $("#mb_nick_default").val();
	var wVal = $("#w").val();
	var msg = reg_mb_nick_check();
	if(msg) {
		$("#nick-stat").text(msg);
		reg_info_access();
		return false;
	} else {
		$("#nick-stat").text('');
		reg_info_access();
	}
});
$(".regMbPwd").bind("change keyup input",function(){
	var regMbPasswordVal = $("#reg_mb_password").val();
	var regMbPasswordReVal = $("#reg_mb_password_re").val();
	if(regMbPasswordVal!=regMbPasswordReVal){
		$("#password-stat").text('비밀번호가 동일하지 않습니다.');
		reg_info_access();
		return false;
	} else {
		$("#password-stat").text('');
		reg_info_access();
	}
});
	// 이메일 검사
$("#reg_mb_email").bind("change keyup input",function(){
	var regMbEmailVal = $("#reg_mb_email").val();
//	var oldEmailVal = $("#old_email").val();
	var wVal = $("#w").val();
	var msg = reg_mb_email_check();
	if(msg) {
		$("#email-stat").text(msg);
		reg_info_access();
		return false;
	} else {
		$("#email-stat").text('');
		reg_info_access();
	}
});
$("#btn-reg").click(function(){
	var regMbIdVal = $("#reg_mb_id").val();
	var regMbNickVal = $("#reg_mb_nick").val();
	var regMbPasswordVal = $("#reg_mb_password").val();
	var regMbPasswordReVal = $("#reg_mb_password_re").val();
	var regMbEmailVal = $("#reg_mb_email").val();
	var infoStatText = $(".info-stat").text();
	var wVal = $("#w").val();
	if(regMbNickVal==''||regMbPasswordVal==''||regMbPasswordReVal==''||regMbEmailVal==''||infoStatText!='') {
		$("#btn-reg").hide();
		$("#reg-guide").show();
	} else {
		$.post(g5_bbs_url+"/register_form_update.php",{
			mode : 'ajaxReg',
			w : wVal,
			mb_id : regMbIdVal,
			mb_password : regMbPasswordVal,
			mb_password_re : regMbPasswordReVal,
			mb_name : '',
			mb_nick : regMbNickVal,
			mb_email : regMbEmailVal
		},function(data){
			if(data!='') {
				if(wVal!='u') {
					$("#userBoxWrap").html('').append([
						regMbNickVal+'님, 오리알터.com에 가입되셨습니다.<br />',
						'유익한 시간 되시기 바랍니다. ^^<br />',
						'가입인사를 「한 줄 열린마당」으로 하시면 오리알터 가족으로 등업해드립니다.'
					].join(''));
				} else {
					$("#btn-undo").click();
					$("#psm_unread_list").prepend(
						'<li><a href="#none"><span class="Cff0">회원 정보가 수정 되었습니다.</span></a></li>'
					);
					$("#mbNick,no-mb-icon2").text(regMbNickVal);
				}
			}
		});
	}
});
var reg_info_access = function() {
	var regMbNickVal = $("#reg_mb_nick").val();
	var regMbPasswordVal = $("#reg_mb_password").val();
	var regMbPasswordReVal = $("#reg_mb_password_re").val();
	var regMbEmailVal = $("#reg_mb_email").val();
	var infoStatText = $(".info-stat").text();
	if(regMbNickVal!=''&&regMbPasswordVal!=''&&regMbPasswordReVal!=''&&regMbEmailVal!=''&&infoStatText=='') {
		$("#reg-guide").hide();
		$("#btn-reg").show();
	} else {
		$("#btn-reg").hide();
		$("#reg-guide").show();
	}
}
var reg_mb_nick_check = function() {
    var result = "";
    $.ajax({
        type: "POST",
        url: g5_bbs_url+"/ajax.mb_nick.php",
        data: {
            reg_mb_nick : ($("#reg_mb_nick").val()),
            reg_mb_id : encodeURIComponent($("#reg_mb_id").val())
        },
        cache: false,
        async: false,
        success: function(data) {
            result = data;
        }
    });
    return result;
}
var reg_mb_email_check = function() {
    var result = "";
    $.ajax({
        type: "POST",
        url: g5_bbs_url+"/ajax.mb_email.php",
        data: {
            "reg_mb_email": $("#reg_mb_email").val(),
            "reg_mb_id": encodeURIComponent($("#reg_mb_id").val())
        },
        cache: false,
        async: false,
        success: function(data) {
            result = data;
        }
    });
    return result;
}
/****/
$("#toggle-map").toggle(
	function(){
		$(".ifr-map,#gmap-area").slideUp();
		$(this).removeClass('dn-map').addClass('up-map');
		$('#map-stat').val('hide');
		navPathHomeIn();
	},
	function(){
		$(".ifr-map,#gmap-area").slideDown();
		$(this).removeClass('up-map').addClass('dn-map');
		$('#map-stat').val('');
		navPathHomeOut();
		$("#goto-header").click();
	}
);

$(".btn-modal").click(function(){
	var title = $(this).attr('rel');
	$.getJSON("../json_do.php?action=getModal&title="+title, function(json) {
		if(json.pageInfo.length>0) {
			$.each(json.pageInfo, function() {
				$(".modal-title").text('오리알터.com '+title);
				$(".modal-body").html(this['pContent']);
			});
		} else {}
	});
});

$(window).scroll(function(){
	var scrollHeight = $(window).scrollTop();
	var mapStatVal = $('#map-stat').val();
	if(mapStatVal=='') {
		if (scrollHeight >= 30||map_id||square_id||md_id||g5_bo_table) {
//		if (map_id||square_id||md_id||g5_bo_table) {
			navPathHomeIn();
		} else {
			navPathHomeOut();
		}
	}
});

var navPathHomeIn = function(){
	if(sect=='ort') {
		$('#logo-sect').hide();
	} else {
		$('#nav-path').fadeIn();
		$('.logo-map').addClass('dispB');
		$('#logo-sect').hide();
	}
}
var navPathHomeOut = function(){
	if(sect=='ort') {
		$('#logo-sect').show();
	} else {
		$('#nav-path').fadeOut();
		$('.logo-map').removeClass('dispB');
		$('#logo-sect').show();
	}
}

$("div").on("click",".scroll",function(event){
	var id = $(this).attr("href");
	var offset = 60;
	var target = $(id).offset().top - offset;
	$('html, body').animate({scrollTop:target}, 500);
	event.preventDefault();
});

	$('.gourl').change(function(){
		if($(".gourl option:selected").val() != ''){
			location.href = $(".gourl option:selected").val();
		}
	});
	$('.gotoUrl').click(function(){
		var rel = $(this).attr('rel');
		var relInfo = rel.split(':');
		location.href = g5_url+"/_"+relInfo[0]+"/?"+relInfo[0]+"_id="+relInfo[1];
	});
	
$("#toggleCateBox").toggle(
	function(){$("#categoryBox").slideUp();},
	function(){$("#categoryBox").slideDown();}
);

//////메뉴
	$("#ort-menu li").mouseenter(function(){
		var divId = $(this).attr('rel');
		$("#ort-menu li").removeClass('active');
		$(this).addClass('active');
		$(".ort-section").removeClass('dispB');
		$("#"+divId).addClass('dispB');
		$(".sectionBox li a.tL"+divId+",.sectionBox li a.mdN").mouseenter();
		/*
		if(sect!=divId) $(".sectionBox li a.tL"+divId).mouseenter();
		else {
//			if(sect_id) $(".sectionBox li a.mL"+sect).mouseenter();
			$(".sectionBox li a.tL"+sect).mouseenter();
		}
		*/
	});
	$(".sectionBox li a").mouseenter(function(){
		var divId = $(this).attr('rel');
		$(".sectionBox li a").removeClass('selected');
		$(this).addClass('selected');
		$(".wL,.mL").addClass('dispN');
		$("#"+divId+"Box").removeClass('dispN');
	});
	$("#navL-menu li").click(function(){
		$('#circle-arrow').click();
		var div_id = $(this).attr('rel');
		$("#ort-menu li#"+div_id+"-li").mouseenter();
	});
	$("#moreWrInfo").click(function(){
		var thisRel = $(this).attr('rel');
		$('#navL-menu li#li-'+thisRel).click();
		$('.sectionBox li a.mL'+thisRel).mouseenter();
	});
//	var windowHeight = $(window).height() - 75; // 화면상 표시되는 영역 높이
//	$(".olt-section").height(windowHeight);

$('.wL').on("click",".btn-page",function(){
	var thisRel = $(this).attr('rel');
	var relInfo = thisRel.split(':');
	$("#"+relInfo[0]+"Box.wL").html('');
	$("#"+relInfo[0]+".loading").show();
	$.post(g5_url+'/inc_'+relInfo[0]+'.php',{
		pageNum : relInfo[1],
		getId : relInfo[4],
		isSqlType : relInfo[5],
		getMb : relInfo[6],
		dbTable : relInfo[7],
		cate : relInfo[8]
	},function(data){
		if(data!='') {
			$("#"+relInfo[0]+".loading").hide();
			$("#"+relInfo[0]+"Box.wL").append(data);
			getPageList(thisRel);
			var sectSubH = $("#sect-sub").height();
			var sectMainH = $("#sect-main").height();
			var plusSectSubH = (sectSubH * 1) + 100;
			if(sectMainH<sectSubH) $("#sect-main").css("height",plusSectSubH+"px");
		}
	});
});
$('.mL').on("click",".btn-page",function(){
	var thisRel = $(this).attr('rel');
	var relInfo = thisRel.split(':');
	$("#"+relInfo[0]+"Box.mL").html('');
	$("#"+relInfo[0]+".loading").show();
	$.post(g5_url+'/inc_'+relInfo[0]+'.php',{
		pageNum : relInfo[1],
		getId : relInfo[4],
		isSqlType : relInfo[5],
		getMb : relInfo[6],
		dbTable : relInfo[7],
		cate : relInfo[8]
	},function(data){
		if(data!='') {
			$("#"+relInfo[0]+".loading").hide();
			$("#"+relInfo[0]+"Box.mL").append(data);
			getPageList(thisRel);
			var sectSubH = $("#sect-sub").height();
			var sectMainH = $("#sect-main").height();
			var plusSectSubH = (sectSubH * 1) + 100;
			if(sectMainH<sectSubH) $("#sect-main").css("height",plusSectSubH+"px");
		}
	});
});
$('.cL').on("click",".btn-page",function(){
	var thisRel = $(this).attr('rel');
	var relInfo = thisRel.split(':');
	$("#"+relInfo[0]+"Box.cL").html('');
	$("#"+relInfo[0]+".loading").show();
	$.post(g5_url+'/inc_'+relInfo[0]+'.php',{
		pageNum : relInfo[1],
		getId : relInfo[4],
		isSqlType : relInfo[5],
		getMb : relInfo[6],
		dbTable : relInfo[7],
		cate : relInfo[8]
	},function(data){
		if(data!='') {
			$("#"+relInfo[0]+".loading").hide();
			$("#"+relInfo[0]+"Box.cL").append(data);
			getPageList(thisRel);
			var sectSubH = $("#sect-sub").height();
			var sectMainH = $("#sect-main").height();
			var plusSectSubH = (sectSubH * 1) + 100;
			if(sectMainH<sectSubH) $("#sect-main").css("height",plusSectSubH+"px");
		}
	});
});
$("#sqCate li.sqCateList").click(function(){
	var thisRel = $(this).attr('rel');
	var relInfo = thisRel.split(':');
	$("#sqCate li.sqCateList .checked").hide();
	$("#"+relInfo[0]+".checked").show();
	$("#sqCateListWrap").show();
	$("#sqCateListBox.cL").html('');
	$.post(g5_url+'/inc_sqCateList.php',{
		cateName : relInfo[0],
		mbId : relInfo[1],
		cateNum : relInfo[2]
	},function(data){
		if(data!='') {
			$("#sqCateListBox.cL").append(data);
			getPageList(thisRel);
		}
	});
});
$(".hide-sqCateList").click(function(){
	$("#sqCateListWrap, #sqCate li .checked").hide();
});
function getPageList(thisRel){
	var relInfo = thisRel.split(':');
	$("#"+relInfo[0]+".pageBox").html('');
	$.getJSON(g5_url+"/json_do.php",{
		action : 'getPageList',
		thisRel : thisRel
	},function(json) {
		if(json.pageListInfo.length>0) {
			$.each(json.pageListInfo, function() {
				$("#"+relInfo[0]+".pageBox").append(this['str']);
			});
		} else {}
	});
}

$(".wL,.mL,#commentsBox,.commentsBox").on("mouseenter","li",function(){
	var thisRel = $(this).attr('rel');
	$(".wL li,.mL li,#commentsBox li,.commentsBox li").css("background","");
	$(this).css("background",thisRel);
});
$(".wL,.mL,#commentsBox,.commentsBox").on("mouseleave","li",function(){
	$(".wL li,.mL li,#commentsBox li,.commentsBox li").css("background","");
});

  $(".datepicker").datepicker({
    dateFormat: 'yy-mm-dd',
    prevText: '이전 달',
    nextText: '다음 달',
    monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
    monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
    dayNames: ['일','월','화','수','목','금','토'],
    dayNamesShort: ['일','월','화','수','목','금','토'],
    dayNamesMin: ['일','월','화','수','목','금','토'],
	changeMonth: true, //월변경가능
    changeYear: true, //년변경가능
    showMonthAfterYear: true,
    yearSuffix: '년'
  });

////////////댓글 기능
$("#openCommentBox2").click(function(){
	if($("#wrCommentsBox").hasClass('open')) {
		var sectMainH = $("#sect-main").height();
		var wrCommentsBoxH = $("#wrCommentsBox").height();
		$("#wrCommentsBox").html('').removeClass('open');
		$("#sect-main").height(sectMainH - wrCommentsBoxH);
	} else {
		var sectMainH = $("#sect-main").height();
		var rel = $(this).attr('rel');
		var relInfo = rel.split(':');
		$("#iconLoading").show();
		$.post(g5_url+"/inc_commentList.php",{
			bo_table : relInfo[0],
			wr_id : relInfo[1]
		},function(data){
			if(data!='') {
				$("#iconLoading").hide();
				$("#wrCommentsBox").append(data).addClass('open');
				var newWrCommentsBoxH = $("#wrCommentsBox").height();
				$("#sect-main").height(sectMainH + newWrCommentsBoxH);
			}
		});
	}
});
$("#openCommentBox1").click(function(){
	if(!$("#wrCommentsBox").hasClass('open')) $("#openCommentBox2").click();
});
/*
if(mode=='openComment') { //url에 mode=openComment가 있으면 댓글창을 미리 연다.
	$("#openCommentBox1").click();
}*/
$("#wrCommentsBox").on("click",".writeComment",function(){
	returnToBaseWrComment();
	$("#writeCommentForm").fadeIn();
	var thisRel = $(this).attr('rel');
	var relInfo = thisRel.split(':');
	$("input#boTable").val(relInfo[0]);
	$("input#parentId").val(relInfo[2]);
	$("input#sca").val(relInfo[3]);
	$("input#wrComment").val(relInfo[5]);
	$("input#w").val('c');
	$("textarea#wrCommentArea").focus();
});
$("#wrCommentsBox").on("click","#writeCommentFormClose",function(){
	returnToBaseWrComment();
	$("#writeCommentForm").fadeOut();
});
$("#wrCommentsBox").on("click",".btn-toolMd",function(){
	returnToBaseWrComment();
	var thisRel = $(this).attr('rel');
	var relInfo = thisRel.split(':');
	var isRe = relInfo[4]*1;
	if(isRe>0) {
		alert('답댓글이 있으면 수정을 할 수 없습니다.');
	} else {
	$("#cL"+relInfo[1]+".wrCommentsList").addClass('bgF6');
	$.getJSON(g5_url+"/json_do.php?action=mdComment&bo_table="+relInfo[0]+"&wr_id="+relInfo[1],function(json) {
		$("#writeCommentForm").fadeIn();
		if(json.commentInfo.length>0) {
			$.each(json.commentInfo, function() {
				$("textarea#wrCommentArea").val(this['wrContent']).focus();
				$("input#boTable").val(relInfo[0]);
				$("input#commentId").val(relInfo[1]);
				$("input#parentId").val(relInfo[2]);
				$("input#sca").val(relInfo[3]);
				$("input#w").val('cu');
				$("span#guideTxt").text('댓글 수정하기');
			});
		} else {}
	});
	}
});
$("#wrCommentsBox").on("click",".btn-toolDl",function(){
	returnToBaseWrComment();
	var thisRel = $(this).attr('rel');
	var relInfo = thisRel.split(':');
	var isRe = relInfo[4]*1;
	if(isRe>0) {
		alert('답댓글이 있으면 삭제를 할 수 없습니다.');
	} else {
	var answer = confirm ('댓글삭제를 원하십니까? 삭제한 댓글은 다시 복원할 수 없습니다.');
	if(answer){
		$.post(g5_bbs_url+"/delete_comment.php",{
			mode : 'ajaxComment',
			bo_table : relInfo[0],
			comment_id : relInfo[1]
		},function(data){
			if(data!='') {
				$("#wrCommentsBox").html('').append(data).removeClass('close');
				var newCommentNum = (relInfo[3]*1) - 1;
				$("span#wrId"+relInfo[2]+".comment-num").text(newCommentNum);
				if(newCommentNum==0)
					$("span#wrId"+relInfo[2]+".comment-num").text('');
			}
		});
	} else {
		return false;
	}
	}
});
$("#wrCommentsBox").on("click",".btn-toolRe",function(){
	returnToBaseWrComment();
	var thisRel = $(this).attr('rel');
	var relInfo = thisRel.split(':');
	$("#cL"+relInfo[1]+".wrCommentsList").addClass('bgF6');
	$("#writeCommentForm").fadeIn();
	$("input#boTable").val(relInfo[0]);
	$("input#commentId").val(relInfo[1]);
	$("input#parentId").val(relInfo[2]);
	$("input#sca").val(relInfo[3]);
	$("input#wrComment").val(relInfo[5]);
	$("input#w").val('c');
	$("span#guideTxt").text(relInfo[4]+'님의 댓글에 답댓글 쓰기');
	$("textarea#wrCommentArea").focus();
});
$("#wrCommentsBox").on("click","#wrCommentBtn",function(){
	var wrSecret = $("input#wrSecret").val();
	var w = $("input#w").val();
	var boTable = $("input#boTable").val();
	var commentId = $("input#commentId").val();
	var parentId = $("input#parentId").val();
	var sca = $("input#sca").val();
	var wrCommentArea = $("textarea#wrCommentArea").val();
	var wrCommentArea = $.trim(wrCommentArea);
	var wrComment = $("input#wrComment").val();
	var wrCommentsBoxH = $("#wrCommentsBox").height();
	$.post(g5_bbs_url+"/write_comment_update.php",{
		mode : 'ajaxComment',
		wr_content : wrCommentArea,
		w : w,
		bo_table : boTable,
		comment_id : commentId,
		wr_id : parentId,
	},function(data){
		if(data!='') {
			$("#wrCommentsBox").addClass('open').height(wrCommentsBoxH).html('').append(data);
			var newCommentNum = (wrComment*1) + 1;
			if(w=='c') {
			$("span#wrId"+parentId+".commentNum").html("<span class='comment-num'>"+newCommentNum+"</span>");
				if(commentId) {
					$.get(g5_url+"json_do.php?action=getReWrIdInfo&bo_table="+boTable+"&wr_id="+commentId, function( data ) {
						$("#repl"+parentId).append('<a type="button" class="btn btn-warning btn-xs scroll btn-reWrId" href="#cL'+this['wrId']+'">'+this['wrName']+' <i class="fa fa-arrow-circle-down"></i></a> &nbsp;');
					});
				}
			}
			getBoTableComments(boTable,parentId);
//			$("#footer").hide();
		}
	});
	returnToBaseWrComment();
	$("#writeCommentForm").fadeOut();
});
function getBoTableComments(boTable,wrId){
	$.post(g5_url+"/inc_commentBox.php",{
		boTable : boTable,
		wrId : wrId
	},function(data){
		if(data!='') {
			$("#commentsBoxWrap").html('').append(data);
		}
	});
}
$("div").on("click",".commentsLi",function(){
	var thisId = $(this).attr('id');
	var idInfo = thisId.split('-');
	if(idInfo[0]=='madang')
	location.replace(g5_url+'/?md_id='+idInfo[1]+'&mode=openComment#goto'+idInfo[2]);
	else
	location.replace(g5_url+'/_'+idInfo[0]+'/?'+idInfo[0]+'_id='+idInfo[1]+'&mode=openComment#goto'+idInfo[2]);
});
$("#wrCommentsBox").on("click",".btn-seWrId",function(){
	var seWrId = $(this).attr('href');
	$(".wrCommentsList").removeClass('bgDdf');
	$(seWrId).addClass('bgDdf');
});
$("#wrCommentsBox").on("click",".btn-reWrId",function(){
	var seWrId = $(this).attr('href');
	$(".wrCommentsList").removeClass('bgFfc');
	$(seWrId).addClass('bgFfc');
});
function returnToBaseWrComment() {
	$(".wrCommentsList").removeClass('bgF6');
	$("textarea#wrCommentArea").val('');
	$("input#boTable").val('');
	$("input#commentId").val('');
	$("input#w").val('');
	$("input#parentId").val('');
	$("input#sca").val('');
	$("input#wrSecret").attr("checked", false);
	$("span#guideTxt").text('댓글 쓰기');
	$(".wrCommentsList").removeClass('bgDdf').removeClass('bgFfc');
}
if(!g5_is_mobile||cur_width>=752) {
$(window).scroll(function(){
	var scrollTop = $(window).scrollTop();
	var writeInfoTop = $('#writeInfo').offset().top;
	var commentsBoxTop = $('#commentsBox').offset().top;
	var gap = writeInfoTop - scrollTop;
	if(gap<50) {
		$('#userBox').removeClass('abs').addClass('fix');
//	} else if(gap>=50) {
	} else {
		$('#userBox').removeClass('fix').addClass('abs');
	}
});
}

//////////////////로그인
$("#login_auto_login").click(function(){
	if (this.checked) {
		this.checked = confirm("자동로그인을 사용하시면 다음부터 회원아이디와 패스워드를 입력하실 필요가 없습니다.\n\n공공장소에서는 개인정보가 유출될 수 있으니 사용을 자제하여 주십시오.\n\n자동로그인을 사용하시겠습니까?");
	}
});

///////구글맵 관련
    $("#gmap").goMap({
		latitude: 35.72129098165948,
        longitude: 127.01851844787598,
		zoom: 14,
		maptype: 'ROADMAP',
		hideByClick: true,
		oneInfoWindow: false,
        disableDoubleClickZoom: false,
		scrollwheel: false
    });

$(window).load(function(){
	var pUrl = pageUrl.split('/');
	var sect = pUrl[1];
	if(map_id) {
		getPhotos(map_id,'popupTrue');
	} else if(sect=='_map') {
//		$("#imgArray li").click();
	} else if(wr_id) {
		getPhotos(wr_id,'popupTrue');
	}
});

	$(".map-address").keypress(function(event){
		if(event.keyCode == 13) {
			event.preventDefault();
			$(".map-search-info").html('');
			var addr_val = $(this).val();
			if(!addr_val) $(".map-search-info").html("<a href='#none' class='list-group-item active'>주소 혹은 지명을 입력하세요.</a>");
			else getMapInfo(addr_val);
		}
	});
	
	$(".map-search-button").click(function(){
		$(".map-search-info").html('');
		var addr_val = $(".map-address").val();
		if(!addr_val) $(".map-search-info").html("<a href='#none' class='list-group-item active'>주소 혹은 지명을 입력하세요.</a>");
		else {
		getMapInfo(addr_val);
		}
	});

	$(".map-search-info").on("click","a.goto-site-pos",function(){
		var thisRel = $(this).attr('rel');
		var thisTitle = $(this).attr('title');
		if(thisRel=='0:p0_') {
			var schCheckArrayVal = $("#schCheckArray").val();
			if (eval(schCheckArrayVal.indexOf('p0_;'))<0) {
				$.goMap.setMap({address:thisTitle});
				$.goMap.createMarker({
					address: thisTitle,
					icon: g5_url+'/img/icon_landMd.png',
					id: 'p0'
				});
				$("#chk0").show();
				var newschCheckArrayVal = 'p0_;'+schCheckArrayVal;
				$("#schCheckArray").val(newschCheckArrayVal);
			} else {
				$.goMap.removeMarker('p0');
				$("#chk0").hide();
				var newschCheckArrayVal = schCheckArrayVal.replace('p0_;','');
				$("#schCheckArray").val(newschCheckArrayVal);
					if(newschCheckArrayVal!='')
						$.goMap.fitBounds();
					else
						$("#btn-orgnPos").click();
			}
		} else {
			getRelVal(thisRel);
		}
	});

	$(".photoNum").click(function(){
		$.goMap.clearMarkers();
		$("#schCheckArray").val('');
		$("#schCheckArray2").val('');
		$(".checkImg").hide();
		var thisRel = $(this).attr('rel');
		var thisRelInfo = thisRel.split(':');
		$("#schCheckArray2").val(thisRelInfo[1]);
		$("#photos-grid2").fadeIn();
		getPhotosGrid(thisRelInfo[0]);
	});
	
	$("#imgArray2").on("click","li",function(){
		var thisId = $(this).attr('id');
		var schCheckArrayVal2 = $("#schCheckArray2").val();
		var sVal2 = schCheckArrayVal2.split("_");
		if (eval(schCheckArrayVal2.indexOf(thisId+'_'))<0) {
			var newschCheckArrayVal2 = thisId+"_"+schCheckArrayVal2;
			$("#schCheckArray2").val(newschCheckArrayVal2);
			$("#chk"+thisId).show();
		} else {
			var newschCheckArrayVal2 = schCheckArrayVal2.replace(thisId+'_','');
			$("#schCheckArray2").val(newschCheckArrayVal2);
			$("#chk"+thisId).hide();
		}
		google.maps.event.trigger($($.goMap.mapId).data(thisId), 'click');
	});
	
	$("#photos-grid2 button#close").click(function(){
		$("#photos-grid2").fadeOut();
	});
	
	$.goMap.createListener({type:'map'}, 'click', function(event) {
		$("a.list-group-item").fadeOut();
		$("input#gmap-address").val('');
	});

	if(!g5_is_mobile)
	$(".onTooltip").tooltip('hide');
	
	$("#btn-showHide").toggle(
		function(){
			$("#photos-grid").slideUp();
			$("#gmap").removeClass("gmapMR").addClass("gmapW100");
		},
		function(){
			$("#photos-grid").slideDown();
			$("#gmap").removeClass("gmapW100").addClass("gmapMR");
		}
	);
	
	$("#btn-allCheck").click(function(){
		$("#imgArray li").click();
		var schCheckArrayVal = $("#schCheckArray").val();
		if(schCheckArrayVal!='') $.goMap.fitBounds();
		else $("#btn-orgnPos").click();
	});

	$("#btn-window").click(function(){
		var schCheckArrayVal = $("#schCheckArray").val();
		if(schCheckArrayVal=='') $("#gmap-window").fadeIn('fast').text("선택한 사진그룹이 없습니다.").fadeOut(3000);
		var sVal = schCheckArrayVal.split("_");
		var sValNum = sVal.length - 1;
		for(var i=0;i<sValNum;i++) {
			var sVal2 = sVal[i].replace(';','');
			google.maps.event.trigger($($.goMap.mapId).data(sVal2), 'click');
		}
	});

	$("#btn-orgnPos").click(function(){
		$.goMap.setMap({address:'(35.72129098165948, 127.01851844787598)',zoom: 14});
	});
	
	$("#btn-refresh").click(function(){
		var schCheckArrayVal = $("#schCheckArray").val();
		var sVal = schCheckArrayVal.split("_");
		var sValNum = sVal.length - 1;
		for(var i=0;i<sValNum;i++) {
			var sVal2 = sVal[i].replace(';','');
			$.goMap.removeMarker(sVal2);
		}
		$("#btn-orgnPos").click();
		$("#schCheckArray").val('');
		$(".checkImg").hide();
	});
	
	$("#btn-unMapPos").click(function(){
		var chkPhotosVal = $("#chkPhotos").val();
		$.ajax({
			type : "post",
			url  : g5_url+"/json_do.php",
			data : {
				action : "unMapPos",
				chkPhotos : chkPhotosVal
			},
			success : function(data){
				$("#alert-window").fadeIn().html("선택한 사진(들)의 지도위치가<br />취소되었습니다.").fadeOut(3000);
				location.reload();
			}
		});
	});

if(wr_id) {
	$.goMap.createListener({type:'map'}, 'click', function(event) {
		$("#mapPos").val(event.latLng);
		var mapPosVal = $("#mapPos").val();
		var chkPhotosVal = $("#chkPhotos").val();
		$("#chkPhotos").val('');
		$("#imgArray li i.checkImg").hide();
		$(".msgPhotos").html('선택한 사진이 없습니다.');
		$("#btn-unMapPos").fadeOut();
		var uploadPhotos = '';
		if(g5_is_member) {
			uploadPhotos = '<form action="'+g5_url+'/json_do.php" method="post"><input type="hidden" name="action" value="uploadPhotos"><input type="hidden" name="mapPos" value="'+mapPosVal+'"><input type="hidden" name="mapUrl" value="'+pageUrl+'"><input type="hidden" name="chkPhotos" value="'+chkPhotosVal+'"><span class="Ccrimson msgPhotos">선택한 사진이 없습니다.</span><br /><button type="submit" class="btn btn-primary btn-xs"><i class="fa fa-map-marker"></i> 이 지도 위치에 사진 올리기</button></form>';
		}
		$.goMap.createMarker({
			latitude: getLat(mapPosVal),
			longitude: getLng(mapPosVal),
			icon: g5_url+'/img/icon_landMg.png',
			html: {
				content: '<div class="imgMarker ff-ng">새로 지정한 위치입니다.<div class="infoWindow">'+uploadPhotos+'</div></div>',
				popup: true
			},
			draggable: false
        });
	});
}
if(wr_id) {
//	$(".checkImg").hide();
	$("#imgArray li").click(function(){
		var thisId = $(this).attr('id');
		var chkPhotosVal = $("#chkPhotos").val();
		if (eval(chkPhotosVal.indexOf(thisId+'_'))<0) {
			var newchkPhotosVal = thisId+"_"+chkPhotosVal;
			$("#chkPhotos,input[name=chkPhotos]").val(newchkPhotosVal);
			$("#imgArray li i#chk"+thisId).show();
			var chkPhotosVal = $("#chkPhotos").val();
			var cP = chkPhotosVal.split('_');
			var cPnum = cP.length - 1;
			if(cPnum>0) $(".msgPhotos").html('선택한 사진 '+cPnum+'개');
			else $(".msgPhotos").html('선택한 사진이 없습니다.');
		} else {
			var newchkPhotosVal = chkPhotosVal.replace(thisId+'_','');
			$("#chkPhotos").val(newchkPhotosVal);
			$("#imgArray li i#chk"+thisId).hide();
			var chkPhotosVal = $("#chkPhotos").val();
			var cP = chkPhotosVal.split('_');
			var cPnum = cP.length - 1;
			if(cPnum>0) $(".msgPhotos").html('선택한 사진 '+cPnum+'개');
			else $(".msgPhotos").html('선택한 사진이 없습니다.');
		}
		if(chkPhotosVal!='') $("#btn-unMapPos").fadeIn();
		else $("#btn-unMapPos").fadeOut();
	});
} else if(map_id) {
	$("#imgArray li").click(function(){
		var thisId = $(this).attr('id');
		var schCheckArrayVal2 = $("#schCheckArray2").val();
		var sVal2 = schCheckArrayVal2.split("_");
		if (eval(schCheckArrayVal2.indexOf(thisId+'_'))<0) {
			var newschCheckArrayVal2 = thisId+"_"+schCheckArrayVal2;
			$("#schCheckArray2").val(newschCheckArrayVal2);
			$("#chk"+thisId).show();
		} else {
			var newschCheckArrayVal2 = schCheckArrayVal2.replace(thisId+'_','');
			$("#schCheckArray2").val(newschCheckArrayVal2);
			$("#chk"+thisId).hide();
		}
		google.maps.event.trigger($($.goMap.mapId).data(thisId), 'click');
	});
} else {
	$("#imgArray li").click(function(){
		var thisRel = $(this).attr('rel');
		getRelVal(thisRel);
	});
}	

function getRelVal(RelVal) {
	var relInfo = RelVal.split(":");
	var map_id = relInfo[0];
	var photos_ids = relInfo[1];
	var photo_id = photos_ids.split("_");
	var photos_num = photo_id.length - 1;
	var popupStatVal = $("#popupStat").val();
	var schCheckArrayVal = $("#schCheckArray").val();
	if (eval(schCheckArrayVal.indexOf(photos_ids+';'))<0) {
		$("#chkP"+map_id).show();
		getPhotos(map_id,popupStatVal);
		var newschCheckArrayVal = photos_ids+';'+schCheckArrayVal;
		$("#schCheckArray").val(newschCheckArrayVal);
	} else {
		for(var i=0;i<photos_num;i++) { $.goMap.removeMarker(photo_id[i]); }
		$("#chkP"+map_id).hide();
		var newschCheckArrayVal = schCheckArrayVal.replace(photos_ids+';','');
		$("#schCheckArray").val(newschCheckArrayVal);
			if(newschCheckArrayVal!='') $.goMap.fitBounds();
			else $("#btn-orgnPos").click();
	}
}
	
function getMapInfo(map_info) {
	$.getJSON(g5_url+"/json_do.php?action=map_search_info&map_info="+map_info, function(json) {
		$(".map-search-info").html("<a href='#none' class='list-group-item active'>주소/지명 검색 정보</a><a href='#none' class='goto-site-pos list-group-item text-center' title='"+map_info+"' rel='0:p0_'><strong>"+map_info+"</strong><i class='fa fa-check-square-o fa-2x checkImg dispN' id='chk0'></i></a>");
		if(json.mapInfo.length>0) {
			$.each(json.mapInfo, function() {
			var unposNum = this['unpos_num'];
			if(unposNum>0) unposNum = '<span class="Cmagenta">(위치미지정:'+unposNum+')</span>';
			else unposNum = '';
			var schCheckArrayVal = $("#schCheckArray").val();
			if (eval(schCheckArrayVal.indexOf(this['photosIds']+';'))<0)
				var	info = '<a href="#none" class="goto-site-pos list-group-item bgFc" title="'+this['map_name']+'" rel="'+this['map_id']+':'+this['photosIds']+'"><span class="Caaa">'+this['map_name']+'</span><br /><span class="fs-08">사진 갯수 : '+this['photo_num']+unposNum+'</span><i class="fa fa-check-square-o fa-2x checkImg dispN" id="chk'+this['map_id']+'"></i></a>';
			else
				var	info = '<a href="#none" class="goto-site-pos list-group-item bgFc" title="'+this['map_name']+'" rel="'+this['map_id']+':'+this['photosIds']+'"><span class="Caaa">'+this['map_name']+'</span><br /><span class="fs-08">사진 갯수 : '+this['photo_num']+unposNum+'</span><i class="fa fa-check-square-o fa-2x checkImg" id="chk'+this['map_id']+'"></i></a>';			
				$(".map-search-info").append(info);
			});
		} else {}
	});
}

function getPhotos(map_id,popup) {
	$.getJSON(g5_url+"/json_do.php?action=map_id_photos&map_id="+map_id, function(json) {
		if(json.photoInfo.length>0) {
			$.each(json.photoInfo, function() {
				var unposNum = this['unpos_num'];
				if(unposNum>0) unposNum = '<span class="Cmagenta fs-08"> (위치미지정:'+unposNum+')</span>';
				else unposNum = '';
				var popupstat;
				if(popup=='popupTrue') popupstat = true;
				else if(popup=='popupFalse') popupstat = false;
				var uploadPhotos = '';
				if(wr_id)
					uploadPhotos = '<form action="'+g5_url+'/json_do.php" method="post"><input type="hidden" name="action" value="uploadPhotos"><input type="hidden" name="mapPos" value="'+this['photo_pos']+'"><input type="hidden" name="mapUrl" value="'+pageUrl+'"><input type="hidden" name="chkPhotos"><span class="Ccrimson msgPhotos">선택한 사진이 없습니다.</span><br /><button type="submit" class="btn btn-primary btn-xs"><i class="fa fa-map-marker"></i> 이 지도 위치에 사진 올리기</button></form>';
				var samePosNum = this['samePos_num'];
				if(samePosNum>1) samePosNum = '<br /><span class="sameMapPos">&nbsp;<i class="fa fa-map-marker"></i> 동일 위치 : '+samePosNum+'&nbsp;</span>';
				else samePosNum = '';
				$.goMap.createMarker({
					latitude: getLat(this['photo_pos']),
					longitude: getLng(this['photo_pos']),
					id: this['photo_id'],
					icon: g5_url+'/img/icon_landMb.png',
					hideByClick: true,
					draggable: true,
					html: {
						content: '<div class="imgMarker"><img src="'+this['photo_thumb']+'"><br /><strong>'+this['photo_title']+'</strong><div class="txtL C999 cl-bo"><a href="'+g5_url+'/_map/?map_id='+map_id+'" target="_top"><i class="fa fa-map-marker"></i> '+this['map_name']+'</a><br /><i class="fa fa-camera"></i> '+this['photo_date']+'<br /><span>사진 갯수 : '+this['photo_num']+unposNum+samePosNum+'</span>'+uploadPhotos+'</div></div>',
						popup: popupstat
					}
				});
				$.goMap.fitBounds();
			});
		} else {}
	});
}

function getPhotosGrid(map_id) {
	$.getJSON(g5_url+"/json_do.php?action=map_id_photosGrid&map_id="+map_id, function(json) {
		$("#imgArray2").html('');
		if(json.photoInfo.length>0) {
			$.each(json.photoInfo, function() {
				$("#mapTitle").text(this['map_name']);
				var info = '<li style="background:url('+this['photo_thumb']+');background-position:center center;" id='+this['photo_id']+'><i class="fa fa-check-square-o fa-2x checkImg2" id="chk'+this['photo_id']+'"></i>'+this['sMPC']+'</li>';
				$("#imgArray2").append(info);
			});
		} else {}
	});
}

$("button#accessPhotos").click(function(){
	var thisRel = $(this).attr('rel');
	$.ajax({
		type : "post",
		url  : g5_url+"/json_do.php",
		data : {
			action : "accessPhotos",
			thisRel : thisRel,
		},
		success : function(data){
			alert('접수 혹은 취소 처리');
		}
	});
});

$(".togglePhotoBox").click(function(){
	var id = $(this).attr('id');
	var BidH = $('#B'+id).height();
	var BBidH = $('#BB'+id).height();
	if($('#B'+id).hasClass('dispN')) {
		$('#B'+id).removeClass('dispN');
		if(BidH>=BBidH) $('#BB'+id).height(BidH);
	} else {
		$('#B'+id).addClass('dispN');
		$('#BB'+id).height('');
	}
});

function getLat(position) { ////위도값 뽑기
	var posArray = position.split(",");
	var latTrim = $.trim(posArray[0]);
	var Latlen = latTrim.length - 1;
	var Lat = latTrim.substr(1,Latlen);
	return Lat;
}
function getLng(position) { ////경도값 뽑기
	var posArray = position.split(",");
	var lngTrim = $.trim(posArray[1]);
	var Lnglen = lngTrim.length - 1;
	var Lng = lngTrim.substr(0,Lnglen);
	return Lng;
}
///////구글맵 관련
/*
// textarea id, 제한 글자 수, 입력 결과 메세지 저장 ID
function limitCharacters(textid, limit, limitid)
{
        // 잆력 값 저장
        var text = $('#'+textid).val();
        // 입력값 길이 저장
        var textlength = text.length;
        if(textlength < limit)
        {
                $('#' + limitid).html('글내용을 '+limit+'자 이상  ');
                // 제한 글자 길이만큼 값 재 저장
                $('#'+textid).val(text.substr(0,limit));
                return false;
        }
        else
        {
                $('#' + limitid).html('쓸수 있는 글자가 '+ (limit - textlength) +
                ' 자 남았습니다.');
                return true;
        }
}
*/
$("#autoGrow").autoGrow(); // 전체 적용. 텍스트에어리어 자동스크롤

///////아이프레임 높이 자동조절
    $('iframe.ifrm').load(function() {
        $(this).css("height", $(this).contents().find("body").height() + "px");
    });
	
}); //jquery 끝

function fsearchbox_submit(f)
{
	if (f.stx.value.length < 2) {
		alert("검색어는 두글자 이상 입력하십시오.");
		f.stx.select();
		f.stx.focus();
		return false;
	}
		// 검색에 많은 부하가 걸리는 경우 이 주석을 제거하세요.
		var cnt = 0;
		for (var i=0; i<f.stx.value.length; i++) {
			if (f.stx.value.charAt(i) == ' ')
					cnt++;
		}

		if (cnt > 1) {
			alert("빠른 검색을 위하여 검색어에 공백은 한개만 입력할 수 있습니다.");
			f.stx.select();
			f.stx.focus();
			return false;
		}
			return true;
}
