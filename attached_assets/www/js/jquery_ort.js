$(document).ready(function(){

window.scrollTo(0,0);

$(window).scroll(function(){
	var scrollH = $(window).scrollTop();
	var topBoxH = $('#top-box').scrollTop();
		if(scrollH >= 70)
			navPathHomeIn();
		else
			navPathHomeOut();
	$('.testMsg').text(scrollH);
});

$("#sqContent a").attr("target","_blank"); //본문 링크를 새창으로 띄우기

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
	/*
	$.getJSON("../json_do.php?action=getModal&title="+title, function(json) {
		if(json.pageInfo.length>0) {
			$.each(json.pageInfo, function() {
				$(".modal-title").text('오리알터.com '+title);
				$(".modal-body").html(this['pContent']);
			});
		} else {}
	});
	*/
});

var navPathHomeIn = function(){
//	$('#top-bar').slideDown();
	if(!$('#top-bar').hasClass('showTopBar'))
	$('#top-bar').animate({marginTop:'+=50px'},500).addClass('showTopBar');
	$('.mainCommFix,.sqSubFix').css('top','49px');
	$('.hideSub').css('top','54px');
}
var navPathHomeOut = function(){
//	$('#top-bar').slideUp();
	if($('#top-bar').hasClass('showTopBar'))
	$('#top-bar').animate({marginTop:'-=50px'},500).removeClass('showTopBar');
	$('.mainCommFix,.sqSubFix').css('top','70px');
	$('.hideSub').css('top','75px');
}
/*
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
*/

$("#goto-search").toggle(
	function(){
		$("#input-search").fadeIn();
	},
	function(){
		$("#input-search").val('');
		$("#input-search,#button-search").fadeOut();
	}
);
$("#input-search").keyup(function(){
	var texts = $(this).val();
	var texts = texts.replace("  "," ");//공백 2개를 1개로
	$(this).val(texts);
	var textsLen = texts.length;
	if(textsLen>=2) $("#button-search").fadeIn();
	else $("#button-search").fadeOut();
});

$("img.lazyload").lazyload({
	placeholder : g5_url+"/img/ajaxLoader.gif"
});

$("textarea.tx-wr-content").jqte();

if(g5_is_mobile) {
$("textarea,input").focus(function(){
	$("#goto-header").hide();
});
$("textarea,input").blur(function(){
	$("#goto-header").show();
});
}

$('.gotoUrl').click(function(){
	var thisRel = $(this).attr('rel');
	var relInfo = thisRel.split(':');
	location.href = g5_url+"/_"+relInfo[0]+"/?"+relInfo[0]+"_id="+relInfo[1];
});
$(".calTd").click(function(){
	var thisRel = $(this).attr('rel');
	var relInfo = thisRel.split('-');
	location.href = g5_url+"/_calendar"+"/?cal="+relInfo[3]+"&Dcode="+relInfo[0]+"-"+relInfo[1]+"-"+relInfo[2];
});

var cur_width = $(window).width();
if(cur_width<1000) {
	$("#mainSquare").removeClass('mainSquare').addClass('mainSquareMo');
	$("#mainMap").removeClass('mainMapAbs').addClass('mainMapMo');
	$("#mainComm").removeClass('mainCommAbs').addClass('mainCommFix');
	$("#sqSub").removeClass('sqSubAbs').addClass('sqSubFix');
	$("#noticeL").removeClass('noticeL').addClass('noticeLMo');
	$("#noticeR").removeClass('noticeRAbs').addClass('noticeRMo');
	$("#subBtn,.hideSub,#show-mainComm").show();
	$("#sqCon").css("margin-right","0px");
	$("#sqView").css("padding","0 5px");
	$(".navBox").addClass('marL10');
} else {
	$("#mainSquare").removeClass('mainSquareMo').addClass('mainSquare');
	$("#mainMap").removeClass('mainMapMo').addClass('mainMapAbs');
	$("#mainComm").removeClass('mainCommFix').addClass('mainCommAbs');
	$("#sqSub").show().removeClass('sqSubFix').addClass('sqSubAbs');
	$("#noticeL").removeClass('noticeLMo').addClass('noticeL');
	$("#noticeR").removeClass('noticeRMo').addClass('noticeRAbs');
	$("#subBtn,.hideSub,#show-mainComm").hide();
	$("#sqCon").css("margin-right","260px");
	$("#sqView").css("padding","0 0 15px 15px");
	$(".navBox").removeClass('marL10');
}

var cur_width = $(window).width();
var conWrapW = $("#con-wrap").width();
var sqViewW = $("#sqView").width();
if(!sect_id) {
	if(cur_width<1000) sVW = conWrapW;
	else sVW = conWrapW - 260;
} else {
	sVW = sqViewW;
}
$.post(g5_url+"/json_do.php",{
	action : 'upIPnSectViewWidth',
	sVW : sVW,
	addr : addr
},function(data){
	if(data!='') {}
});

$(window).resize(function(){
var cur_width = $(window).width();
if(cur_width<1000) {
	$("#mainSquare").removeClass('mainSquare').addClass('mainSquareMo');
	$("#mainMap").removeClass('mainMapAbs').addClass('mainMapMo');
	$("#mainComm").removeClass('mainCommAbs').addClass('mainCommFix');
	$("#sqSub").removeClass('sqSubAbs').addClass('sqSubFix');
	$("#noticeL").removeClass('noticeL').addClass('noticeLMo');
	$("#noticeR").removeClass('noticeRAbs').addClass('noticeRMo');
	$("#subBtn,.hideSub,#show-mainComm").show();
	$("#sqCon").css("margin-right","0px");
	$("#sqView").css("padding","0 5px");
	$(".navBox").addClass('marL10');
} else {
	$("#mainSquare").removeClass('mainSquareMo').addClass('mainSquare');
	$("#mainMap").removeClass('mainMapMo').addClass('mainMapAbs');
	$("#mainComm").removeClass('mainCommFix').addClass('mainCommAbs');
	$("#sqSub").show().removeClass('sqSubFix').addClass('sqSubAbs');
	$("#noticeL").removeClass('noticeLMo').addClass('noticeL');
	$("#noticeR").removeClass('noticeRMo').addClass('noticeRAbs');
	$("#subBtn,.hideSub,#show-mainComm").hide();
	$("#sqCon").css("margin-right","260px");
	$("#sqView").css("padding","0 0 15px 15px");
	$(".navBox").removeClass('marL10');
}

var cur_width = $(window).width();
var conWrapW = $("#con-wrap").width();
var sqViewW = $("#sqView").width();
if(!sect_id) {
	if(cur_width<1000) sVW = conWrapW;
	else sVW = conWrapW - 260;
} else {
	sVW = sqViewW;
}
$.post(g5_url+"/json_do.php",{
	action : 'upIPnSectViewWidth',
	sVW : sVW,
	addr : addr
},function(data){
	if(data!='') {}
});
});

$(".toggleMapBox").click(function(){
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
$(".mapBox").click(function(){$(this).addClass('dispN')});
$(".expandPhoto").click(function(e){
	var thisRel = $(this).attr('rel');
	var relInfo = thisRel.split('^');
	var scrollHeight = $(window).scrollTop();
	var thisTop = e.clientY*1 + scrollHeight - 100;
	var windowW = $(window).width();
	var divW = relInfo[0];
	if(relInfo[0]>windowW) divW = windowW;
	var halfWidth = (divW*1) / 2;
	$("#expandPhotoBox").fadeIn().css({'top':thisTop+'px','margin-left':'-'+halfWidth+'px','width':divW+'px'}).html('<img src='+relInfo[1]+' width="100%" />');
});
$("#expandPhotoBox").click(function(){
	$(this).html('').fadeOut();
});

$("#menu-box li").click(function(){
/*
	if(g5_is_member) {
		$("#menu-box li").removeClass('us2').addClass('us1');
		$(this).removeClass('us1').addClass('us2');
	} else {
		$("#menu-box li").removeClass('ts2').addClass('ts1');
		$(this).removeClass('ts1').addClass('ts2');
	}
*/
	$("#menu-box li").removeClass('ts2').addClass('ts1');
	$(this).removeClass('ts1').addClass('ts2');
	$("#sect-wrap").html('');
	$("#userMenuBox").hide();
	$("#menu-loading").show();
	$("#top-menu").slideDown();
	var thisRel = $(this).attr('rel');
	var thisRelInfo = thisRel.split(':');
	if(thisRelInfo[0]=='user') {
		$("#menu-loading").hide();
		$("#userMenuBox").show();
	} else {
		$.post(g5_url+"/inc_menu.php",{
			menu : thisRelInfo[0],
			sectId : sect_id,
			uId : thisRelInfo[1]
		},function(data){
			if(data!='') {
				$("#menu-loading,#userMenuBox").hide();
				$("#sect-wrap").append(data);
			}
		});
	}
});
$("#mngCate").click(function(){
	$("#menu-box li#user,#showMngCaBox").click();
});
$('#pfBoxWrap').on("click","#mngPf",function(){
	var thisRel = $(this).attr('rel');
	$("#pfCon,#mngPf").slideUp();
	$("#pfForm").slideDown();
	$("textarea#pfConTxt").focus();
});
$('#pfBoxWrap').on("click","#undoPf",function(){
	$("#pfForm").slideUp();
	$("#pfCon,#mngPf").slideDown();
});
$('#pfBoxWrap').on("click","#upPfCon",function(){
	var pfConTxt = $("#pfConTxt").val();
	var mbId = $("#mbId").val();
	$("#pfBoxWrap").html('');
	$("#pfLoading").show();
	$.post(g5_url+'/inc_profile.php',{
		mode : 'upPf',
		pfConTxt : pfConTxt,
		mbId : mbId
	},function(data){
		if(data!='') {
			$("#pfLoading").hide();
			$("#pfBoxWrap").append(data);
		}
	});
});
$("#hide-menu").click(function(){
//	if(g5_is_member)
//		$("#menu-box li").removeClass('us2').addClass('us1');
//	else
		$("#menu-box li").removeClass('ts2').addClass('ts1');
	$("#sect-wrap").html('');
	$("#userMenuBox").hide();
	$("#top-menu").slideUp();
});
$(".showSub").click(function(){
	var thisId = $(this).attr('id');
	$("#sqSub.sqSubFix,#mainComm.mainCommFix").fadeIn();
	if(thisId=='profile'&&g5_is_mobile) {
		$("#commentsBox,#mngCate,#sqCate").hide();
		$("#pfBox,#mngPf").show();
	}
	if(thisId=='cate'&&g5_is_mobile) {
		$("#pfBox,#mngPf,#commentsBox").hide();
		$("#mngCate,#sqCate").show();
	}
	if(thisId=='comm'&&g5_is_mobile) {
		$("#pfBox,#mngPf,#mngCate,#sqCate").hide();
		$("#commentsBox").show();
	}
});
$(".hideSub").click(function(){$("#sqSub.sqSubFix,#mainComm.mainCommFix").fadeOut();});
$('#sect-wrap').on("mouseenter","li",function(){
	$(this).addClass('hover');
});
$('#sect-wrap').on("mouseleave","li",function(){
	$(this).removeClass('hover');
});
$('#sect-wrap').on("click","li",function(){
	var thisRel = $(this).attr('rel');
	location.href = thisRel;
});

$('.innerPaging').on("click",".btn-page",function(){
	var thisRel = $(this).attr('rel');
	var relInfo = thisRel.split(':');
	$("#"+relInfo[0]+"Box.innerPaging").html('');
	$("#"+relInfo[0]+"Loading").show();
	$.post(g5_url+'/inc_'+relInfo[0]+'.php',{
		pageNum : relInfo[1],
		getId : relInfo[4],
		isSqlType : relInfo[5],
		getMb : relInfo[6],
		dbTable : relInfo[7],
		cate : relInfo[8]
	},function(data){
		if(data!='') {
			$("#"+relInfo[0]+"Loading").hide();
			$("#"+relInfo[0]+"Box.innerPaging").append(data);
			getPageList(thisRel);
		}
	});
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

$("#sqCate li.sqCateList").click(function(){
	var thisRel = $(this).attr('rel');
	var relInfo = thisRel.split(':');
	var sectId = relInfo[5];
	if(sectId=='square') sI = 'sq';
	else if(sectId=='ebook') sI = 'eb';
	else if(sectId=='shop') sI = 'sh';
	$("#sqCate li.sqCateList .checked").hide();
	$("#"+relInfo[0]+".checked").show();
	$("#sqCateListWrap").fadeIn();
	$("#"+sI+"CateListBox.cL").html('');
	$.post(g5_url+'/inc_'+sI+'CateList.php',{
		cateName : relInfo[0],
		mbId : relInfo[1],
		cateNum : relInfo[2],
		maxId : relInfo[3],
		squareId : relInfo[4]
	},function(data){
		if(data!='') {
			$("#"+sI+"CateListBox.cL").append(data);
			getPageList(thisRel);
		}
	});
});
$("#hide-sqCateList").click(function(){
	$("#sqCateListWrap, #sqCate li .checked").fadeOut();
});

$("#btn28j").toggle(
	function(){
		$("#twjang,#twcon").fadeIn();
	},
	function(){
		$("#twjang,#twcon").hide();
	}
);

////////////댓글 기능
$("#openCommentBox2").click(function(){
	if($("#wrCommentsBox").hasClass('open')) {
		var sqViewH = $("#sqView").height();
		var wrCommentsBoxH = $("#wrCommentsBox").height();
		$("#wrCommentsBox").html('').removeClass('open');
		$("#sqView").height(sqViewH - wrCommentsBoxH);
	} else {
		var sqViewH = $("#sqView").height();
		var thisRel = $(this).attr('rel');
		var relInfo = thisRel.split(':');
		$("#iconLoading").show();
		$.post(g5_url+"/inc_commentList.php",{
			bo_table : relInfo[0],
			wr_id : relInfo[1]
		},function(data){
			if(data!='') {
				$("#iconLoading").hide();
				$("#wrCommentsBox").append(data).addClass('open');
				var newWrCommentsBoxH = $("#wrCommentsBox").height();
				$("#sqView").height(sqViewH + newWrCommentsBoxH);
			}
		});
	}
});
$("#openCommentBox1").click(function(){
	if(!$("#wrCommentsBox").hasClass('open')) $("#openCommentBox2").click();
});

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
	if(wrCommentArea.length==0) {
		alert('댓글을 입력하세요.');
		return false;
	}
	$.post(g5_bbs_url+"/write_comment_update.php",{
		mode : 'ajaxComment',
		wr_content : wrCommentArea,
		w : w,
		bo_table : boTable,
		comment_id : commentId,
		wr_id : parentId,
	},function(data){
		if(data!='') {
			$("#wrCommentsBox").addClass('open').html('').append(data);
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
			getSubjCateList(boTable,parentId,sca,mbId);
			getSubjList(boTable,parentId);
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
function getSubjCateList(boTable,wrId,cate,mbId){
	$.post(g5_url+"/inc_subjCateList.php",{
		sectTable : 'g5_write_'+boTable,
		sect_id : wrId,
		sqCate : cate,
		mbId : mbId
	},function(data){
		if(data!='') {
			$("#subjCateListBox").html('').append(data);
		}
	});
}
function getSubjList(boTable,wrId){
	$.post(g5_url+"/inc_subjList.php",{
		sectTable : 'g5_write_'+boTable,
		sect_id : wrId,
	},function(data){
		if(data!='') {
			$("#subjListBox").html('').append(data);
		}
	});
}
$("div").on("click",".commentsLi",function(){
	var thisId = $(this).attr('id');
	var idInfo = thisId.split('-');
	var sectName = idInfo[0];
	if(idInfo[0]=='madang') sectName = 'md';
	else if(idInfo[0]=='notice') sectName = 'no';
	if(sectName=='calendar')
		location.replace(g5_url+'/_'+idInfo[0]+'/?cal=hw&'+sectName+'_id='+idInfo[1]+'&calCate='+idInfo[3]+'&mode=openComment#goto'+idInfo[2]);
	else
		location.replace(g5_url+'/_'+idInfo[0]+'/?'+sectName+'_id='+idInfo[1]+'&mode=openComment#goto'+idInfo[2]);	
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
$(".commList").on("mouseenter","li",function(){
	var thisRel = $(this).attr('rel');
	$(".commList li").css("background","");
	$(this).css("background",thisRel);
});
$(".commList").on("mouseleave","li",function(){
	$(".commList li").css("background","");
});
$(document).on("click",".scroll",function(event){
	var id = $(this).attr("href");
	var offset = 60;
	var target = $(id).offset().top - offset;
	$('html, body').animate({scrollTop:target}, 500);
	event.preventDefault();
});
$("#menu-wrap").on("click","#btnUpCa",function(){
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
$("#showRegForm1,#showRegForm2").click(function(){
	$("#alertBox,#mngCaBox").slideUp();
	$("#regFormBox").slideDown();
});
$("#showMngCaBox").click(function(){
	$("#alertBox,#regFormBox").slideUp();
	$("#mngCaBox").slideDown();
});
$(".btn-undo").click(function(){
	$("#regFormBox,#mngCaBox").slideUp();
	$("#alertBox").slideDown();
});

$("#btn-reg").click(function(){
	var regMbIdVal = $("#reg_mb_id").val();
	var regMbNickVal = $("#reg_mb_nick").val();
	var regMbPasswordVal = $("#reg_mb_password").val();
	var regMbPasswordReVal = $("#reg_mb_password_re").val();
	var regMbEmailVal = $("#reg_mb_email").val();
	var infoStatText = $(".info-stat").text();
	var wVal = $("#w").val();
	
	var msgNick = reg_mb_nick_check();
	if(msgNick) {
		$("#nick-stat").text(msgNick);
		return false;
	} else {
		$("#nick-stat").text('');
	}
	if(regMbPasswordVal==''&&regMbPasswordReVal==''){
		$("#password-stat").text('비밀번호를 입력하세요.');
		return false;
	} else {
		$("#password-stat").text('');
	}
	if(regMbPasswordVal!=regMbPasswordReVal){
		$("#password-stat").text('비밀번호가 동일하지 않습니다.');
		return false;
	} else {
		$("#password-stat").text('');
	}
	var msgEmail = reg_mb_email_check();
	if(msgEmail) {
		$("#email-stat").text(msgEmail);
		return false;
	} else {
		$("#email-stat").text('');
	}
		$.post(g5_bbs_url+"/register_form_update.php",{
			w : wVal,
			mb_id : regMbIdVal,
			mb_password : regMbPasswordVal,
			mb_password_re : regMbPasswordReVal,
			mb_name : '',
			mb_nick : regMbNickVal,
			mb_email : regMbEmailVal,
			mb_open : 1
		},function(data){
			if(data!='') {
				if(wVal!='u') {
					location.replace(g5_url+'?mode=regOk');
				} else {
					$(".btn-undo").click();
					$("#psm_unread_list").prepend(
						'<li><a><span class="Cff0">'+regMbNickVal+'님의 회원정보가 수정 되었습니다.</span></a></li>'
					);
					$("#nickSpan").text(regMbNickVal);
				}
			}
		});
});
$(window).load(function(){
	if(mode=='regOk') {
		$("#msgWindow").fadeIn().html(member_nick+'님,<br />오리알터.com에 가입되셨습니다.<br />[한 줄 열린마당]에 가입인사를 하시면 오리알터 가족으로 등업해드립니다. ^^').fadeOut(5000);
	}
});

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

$("#simpleComment").keypress(function(event){
	if(event.keyCode == 13) {
		event.preventDefault();
	var wrContent = $("#simpleComment.sC").val();
	var wrContent = $.trim(wrContent);
	var w = $("input#w.sC").val();
	var boTable = $("input#bo_table.sC").val();
	var sca = $("input#sca.sC").val();
	var wrSubject = wrContent.substr(0,20);
	if(!g5_is_member) {
		$("#msgWindow").fadeIn().text('로그인 후 쓰기 가능합니다.').fadeOut(3000);
		return false;
	}
	else if(g5_is_member&&wrContent.length<20) {
		$("#msgWindow").fadeIn().text('20자 이상 쓰셔야 합니다.').fadeOut(3000);
		return false;
	}
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
			$("#mainMd").html('').append(data);
//			$("#btnSimpleComment").fadeOut();
			$("#simpleComment.sC").val('');
			$("#txtNum").text('');
		}
	});
	}
});

$("#auto_login").click(function(){
	if ($(this).is(":checked")) {
		if(!confirm("자동로그인을 사용하시면 다음부터 회원별명과 비밀번호를 입력하실 필요가 없습니다.\n\n공공장소에서는 개인정보가 유출될 수 있으니 사용을 자제하여 주십시오.\n\n자동로그인을 사용하시겠습니까?"))
			return false;
	}
});

$("#cal-notice").on("click",".moveWr",function(){
	var thisRel = $(this).attr('rel');
	var relInfo = thisRel.split(':');
	$.getJSON(g5_url+"/json_do.php",{
		action : 'moveWr',
		boTable : relInfo[0],
		wrId : relInfo[1],
		wr1 : relInfo[2],
		newId : relInfo[3],
		new1 : relInfo[4]
	},function(json) {
		if(json.calNoticeInfo.length>0) {
			$.each(json.calNoticeInfo, function() {
				$("#cal-notice").html('').append([
					this['calNoticeList']
				].join(''));
			});
		} else {}
	});
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

});//끝