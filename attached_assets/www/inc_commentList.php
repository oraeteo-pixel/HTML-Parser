<?php
include_once('./_common.php');
if($mode=='openComment') {
	if($square_id) {
		$boTable = "square";
		$wrId = $square_id;
	} else if($map_id) {
		$boTable = "map";
		$wrId = $map_id;
	} else if($md_id) {
		$boTable = "madang";
		$wrId = $md_id;
	} else if($no_id) {
		$boTable = "notice";
		$wrId = $no_id;
	} else if($ebook_id) {
		$boTable = "ebook";
		$wrId = $ebook_id;
	} else if($shop_id) {
		$boTable = "shop";
		$wrId = $shop_id;
	} else if($calendar_id) {
		$boTable = "calendar";
		$wrId = $calendar_id;
	}
} else {
	$boTable = $bo_table;
	$wrId = $wr_id;
}
$dBtable = $g5['write_prefix'].$boTable;
$getWrInfo = get_write($dBtable,$wrId);
?>
<div class="padd10">
	<button type="button" class="btn btn-default btn-sm writeComment" rel="<?php echo $boTable.'::'.$wrId.':'.$getWrInfo['ca_name'].'::'.$getWrInfo['wr_comment']?>"<?php echo $disabled?>><i class="fa fa-pencil"></i> 댓글 쓰기</button>
</div>
<?php
$cmtSql = sql_query(" select * from {$dBtable} where wr_is_comment = 1 and wr_parent = '{$wrId}' order by wr_id ");
for($i=0;$row=sql_fetch_array($cmtSql);$i++) {
	$list[$i]['ip'] = "<a href='http://whois.kisa.or.kr/openapi/whois.jsp?query=".$row['wr_ip']."&key=2013121707364965685900' target='_blank'>(".$row['wr_ip'].")</a>";
	if(!$is_admin) $list[$i]['ip'] = "";
	$len = strlen($row['wr_comment_reply']);
	if($len<0) $len = 0;
	$comment_reply = substr($row['wr_comment_reply'],0,$len);
	$sql = " select count(*) as cnt from {$dBtable}
			where wr_comment_reply like '{$comment_reply}%'
			and wr_id <> '{$row['wr_id']}'
			and wr_parent = '{$wrId}'
			and wr_comment = '{$row['wr_comment']}'
			and wr_is_comment = 1 ";
	$isRe = sql_fetch($sql);
	$disabledMe = ' disabled="disabled"';
	if($is_admin=='super'||($is_member&&($member['mb_id']==$row['mb_id']))) $disabledMe = '';
	$rowDatetime10 = substr($row['wr_datetime'],0,10);
	if($rowDatetime10==G5_TIME_YMD)
		$rowDatetime = substr($row['wr_datetime'],11,8);
	else
		$rowDatetime = $rowDatetime10;
	$seWrCommentReply = substr($row['wr_comment_reply'],0,-1);
	$seMb = sql_fetch(" select wr_id,wr_name from {$dBtable} where wr_is_comment = 1 and wr_parent = '{$row['wr_parent']}' and wr_comment = '{$row['wr_comment']}' and wr_comment_reply = '{$seWrCommentReply}' ");
	$WrCommentReplyLen = strlen($row['wr_comment_reply'])+1;
	$reMb = sql_query(" select wr_id,wr_name from {$dBtable} where wr_is_comment = 1 and wr_parent = '{$row['wr_parent']}' and wr_comment = '{$row['wr_comment']}' and wr_comment_reply like '{$row['wr_comment_reply']}%' and length(wr_comment_reply) = '{$WrCommentReplyLen}' ");
	$wrContent = nl2br($row['wr_content']);
	$schUrl = explode('http',$wrContent);
	$cntUrl = count($schUrl);
	$newCon = $schUrl[0];
	for($u=1;$u<$cntUrl;$u++){
		$wrContent2 = explode("<",$schUrl[$u]);
		$uCode0 = "http".$wrContent2[0];
		$uCode = explode(" ",$uCode0);
		$autoLink = "<a href='".$uCode[0]."' target='_blank'>http".$uCode[0]."</a>";
		$conPart = "http".$schUrl[$u];
		$newCon .= str_replace($uCode[0],$autoLink,$conPart);
	}
?>
<div class='wrCommentsList' id='cL<?php echo $row['wr_id']?>'>
	<span class="goto" id="goto<?php echo $row['wr_id']?>"></span>
	<div class="wrInfo">
		<strong><?php echo $row['wr_name']?></strong>
		<a class="btn btn-default btn-xs" href="javascript:;" onclick="window.open('<?php echo G5_BBS_URL?>/memo_form.php?me_recv_mb_id=<?php echo $row['mb_id']?>','name','resizable=no,width=550,height=500,status=no,scrollbars=yes,menubar=no');return false"><i class="fa fa-envelope-o"></i> 쪽지</a>
		<span class="datetime"><?php echo $rowDatetime?> <?php echo $list[$i]['ip']?></span>
		<a class="scroll" href="#wrCommentsBox"><i class="fa fa-arrow-circle-up"></i></a>
	</div>
	<?php if($disabledMe=='') { ?>
	<div class="tool">
		<button type="button" class="btn btn-success btn-xs btn-toolMd" rel="<?php echo $boTable.':'.$row['wr_id'].':'.$wrId.':'.$getWrInfo['ca_name'].':'.$isRe['cnt']?>"<?php echo $disabledMe?>>수정</button>
		<button type="button" class="btn btn-danger btn-xs btn-toolDl" rel="<?php echo $boTable.':'.$row['wr_id'].':'.$wrId.':'.$getWrInfo['wr_comment'].':'.$isRe['cnt']?>"<?php echo $disabledMe?>>삭제</button>
	</div>
	<?php } ?>
	<div class="content">
		<?php if($row['wr_comment_reply']!='') { ?><a type="button" class="btn btn-info btn-xs scroll btn-seWrId" href="#cL<?php echo $seMb['wr_id']?>"><i class="fa fa-arrow-circle-up"></i> <?php echo $seMb['wr_name']?></a><?php } ?>
		<?php echo $newCon; //nl2br($wrContent)?>
	</div>
	<div class="repl" id="repl<?php echo $row['wr_id']?>">
		<?php for($r=0;$rrow=sql_fetch_array($reMb);$r++) {	?>
			<a type="button" class="btn btn-warning btn-xs scroll btn-reWrId" href="#cL<?php echo $rrow['wr_id']?>"><?php echo $rrow['wr_name']?> <i class="fa fa-arrow-circle-down"></i></a>
			&nbsp;
		<?php } ?>
	</div>
	<div class="tool"><button type="button" class="btn btn-default btn-xs btn-toolRe" rel="<?php echo $boTable.':'.$row['wr_id'].':'.$wrId.':'.$getWrInfo['ca_name'].':'.$row['wr_name'].':'.$getWrInfo['wr_comment']?>"<?php echo $disabled?>><i class="fa fa-pencil"></i> 답댓글</button></div>
</div>
<?php } ?>
<div class="padd10" id="writeCommentBox2">
	<button type="button" class="btn btn-default btn-sm writeComment" rel="<?php echo $boTable.'::'.$wrId.':'.$getWrInfo['ca_name'].'::'.$getWrInfo['wr_comment']?>"<?php echo $disabled?>><i class="fa fa-pencil"></i> 댓글 쓰기</button>
</div>
<div id="writeCommentForm">
	<div id="writeCommentFormWrap">
		<button class="btn btn-default" type="button" id="writeCommentFormClose"><i class="fa fa-times"></i></button>
		<i class="fa fa-pencil"></i> <span id="guideTxt">댓글 쓰기</span>
		<!--div class="txtL">&nbsp; <label><input id="wrSecret" type="checkbox" value="secret"> 비밀글</label></div-->
		<textarea class="wrCommentArea form-control" id="wrCommentArea" placeholder="답댓글이 하나 이상 달리면 수정/삭제가 되지 않음을 미리 알려드립니다. ^^;"></textarea>
		<input id="w" type="hidden" />
		<input id="boTable" type="hidden" />
		<input id="parentId" type="hidden" />
		<input id="commentId" type="hidden" />
		<input id="sca" type="hidden" />
		<input id="wrComment" type="hidden" />
		<button class="btn btn-primary" type="button" id="wrCommentBtn">댓글 쓰기</button>
	</div>
</div>
<?php
//if($mode=='popupComment') ;//include_once('./tail.sub.php');
?>