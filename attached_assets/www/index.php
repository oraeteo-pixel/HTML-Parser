<?php
define('_INDEX_', true);
include_once('./_common.php');

// 초기화면 파일 경로 지정 : 이 코드는 가능한 삭제하지 마십시오.
if ($config['cf_include_index']) {
    if (!@include_once($config['cf_include_index'])) {
        die('기본환경 설정에서 초기화면 파일 경로가 잘못 설정되어 있습니다.');
    }
    return; // 이 코드의 아래는 실행을 하지 않습니다.
}
/*
if (G5_IS_MOBILE) {
    include_once(G5_MOBILE_PATH.'/index.php');
    return;
}
*/
include_once('./_head.php');
?>

<div id="mainSquare" class="mainSquare">
	<button class="btn btn-default showSub" id="show-mainComm"><i class="fa fa-comments"></i></button>
	<div class="navBox1">
		<a href="<?php echo G5_URL?>/_square/"><i class="fa fa-th-large"></i> 오리알터광장</a>
	</div>
	<div id="squareMainBox">
		<?php include G5_PATH."/inc_squareMain.php";?>
	</div>
</div>

<div id="mainMap" class="mainMapAbs">
	<div class="navBox">
		<a href="<?php echo G5_URL?>/_map/"><i class="fa fa-map-marker"></i> 증산순례지도</a>
	</div>
	<div id="imgArray" class="photoGridMain cl-bo">
		<?php
			$is_wr_ok = "";
//			$is_wr_ok = " and wr_1 = 'ok'";
			$photoGrid = sql_query(" select wr_id,mb_id from {$map_table} where wr_is_comment = 0 {$is_wr_ok} order by wr_num limit 0,15 ");
			for($i=0;$row=sql_fetch_array($photoGrid);$i++) {
				$photos = sql_query(" select id from gpf_picasa where wr_id = '{$row['wr_id']}' and map_address != '' order by id ");
				$photosIds = "";
				for($j=0;$prow=sql_fetch_array($photos);$j++) {
					$photosIds .= "p".$prow['id']."_";
				}
				$photoH = sql_fetch(" select thumb2 from gpf_picasa where wr_id = {$row['wr_id']} and map_address != '' order by id limit 0,1 ");
				$photosN = sql_fetch(" select count(id) as num from gpf_picasa where wr_id = {$row['wr_id']} and map_address != '' ");
				$more_photo = $photosN['num'] - 1;
				$photo_num = "<span class='photoNum' rel='".$row['wr_id'].":".$photosIds."' id='photoNum".$row['wr_id']."'></span>";
				if($more_photo>0) $photo_num = "<button class='btn btn-warning btn-xs photoNum' rel='".$row['wr_id'].":".$photosIds."' id='photoNum".$row['wr_id']."'>+".$more_photo."</button>";
				$modify = "";
				if($is_member&&$member['mb_id']==$row['mb_id']&&!G5_IS_MOBILE)
				$modify = "<a class='btn btn-success btn-xs modify' href='".G5_BBS_URL."/write.php?bo_table=map&wr_id=".$row['wr_id']."&w=u'>수정</a>";
		?>
			<li style="background:url('<?php echo $photoH['thumb2']?>');background-position:center center;"	rel="map:<?php echo $row['wr_id']?>" class="gotoUrl">
				<i class="fa fa-check-square-o fa-2x checkImg" id="chkP<?php echo $row['wr_id']?>"></i>
				<?php echo $photo_num//$modify.$photo_num?>
			</li>
		<?php } ?>
	</div>
	<div class="cl-bo"></div>
	<div id="noticeBox" class="round5">
		<h2><i class="fa fa-bullhorn"></i> 공지</h2>
		<?php
			$noSql = sql_query(" select * from {$notice_table} where wr_is_comment = 0 order by wr_num limit 0,3 ");
			for($n=0;$row=sql_fetch_array($noSql);$n++) {
			$rowDatetime10 = substr($row['wr_datetime'],0,10);
			if($rowDatetime10==G5_TIME_YMD)
				$rowDatetime = "<strong>".substr($row['wr_datetime'],11,5)."</strong>";
			else
				$rowDatetime = substr($row['wr_datetime'],5,5);
			$sbj = mb_strimwidth($row['wr_subject'],0,50,"…","UTF-8");
			$noticeNew = "";
			$bold1 = "";
			$bold2 = "";
			if($row['wr_datetime']>=date("Y-m-d H:i:s", G5_SERVER_TIME - (24 * 3600))) {
				$noticeNew = " <span class='alert-num fs-08'>N</span>";
				$bold1 = "<strong>";
				$bold2 = "</strong>";
			}
		?>
		<li><a class="round5" href="<?php echo G5_URL?>/_notice/?no_id=<?php echo $row['wr_id']?>"><span class="date"><?php echo $rowDatetime?></span> <?php echo $bold1.$sbj.$bold2.$noticeNew?></a></li>
		<?php } ?>
	</div>
	<?php /***if($is_admin) { ?><span class="testMsg"></span><?php }/****/ ?>
	<div id="simpleCommentBox" class="round5">
		<h3 class="shadowTitle"><i class="fa fa-pencil-square-o"></i> 한 줄 열린마당</h3>
		<span id="txtNum"></span>
		<input type="hidden" class="sC" id="w" value="" />
		<input type="hidden" class="sC" id="bo_table" value="madang" />
		<input type="hidden" class="sC" id="sca" value="한줄" />
		<textarea class="form-control sC" id="simpleComment" rows="2" placeholder="20자 이상 쓰신 후 엔터키를 누르면 글이 등록됩니다."></textarea>
	</div>
	<div class="navBox">
		<a href="<?php echo G5_URL?>/_madang/"><i class="fa fa-square-o"></i> 열린마당</a>
	</div>
	<div id="mainMd"<?php if(G5_IS_MOBILE) { ?> class="paddL10 paddR10"<?php } ?>>
	<?php include G5_PATH."/inc_madangMain.php";?>
	</div>
	<a href="<?php echo G5_URL?>/_calendar/"><img src="<?php echo G5_IMG_URL?>/mk_ort.png" width="60" height="50" /></a>&nbsp;
	<a href="http://cafe.daum.net/pusan7777" target="_blank"><img src="<?php echo G5_IMG_URL?>/mk_8g.png" /></a>
</div>

<div id="mainComm" class="commList mainCommAbs">
	<button class="btn btn-default hideSub"><i class="fa fa-times"></i></button>
	<h3 id="sub-title"><i class="fa fa-comments fa-2x"></i> 전체 댓글</h3>
<?php
$allWr = sql_query(" select wr_parent,wr_id,bn_id,bo_table from {$g5['board_new_table']} where wr_id <> wr_parent order by bn_id desc ");
$laComm = "";

for($i=0,$j=0;$row=sql_fetch_array($allWr);$i++) {
$thisBoAndPa = $row['wr_parent'].":".$row['bo_table'];
if(strpos($laComm,$thisBoAndPa)!==false) continue;
$laComm .= ",".$thisBoAndPa;
if($row['bo_table']=='map') $icon = "<i class='fa fa-map-marker'></i> ";
if($row['bo_table']=='square') $icon = "<i class='fa fa-th-large'></i> ";
if($row['bo_table']=='madang') $icon = "<i class='fa fa-square-o'></i> ";
if($row['bo_table']=='notice') $icon = "<i class='fa fa-bullhorn'></i> ";
if($row['bo_table']=='calendar') $icon = "<i class='fa fa-calendar'></i> ";
if($row['bo_table']=='ebook') $icon = "<i class='fa fa-university'></i> ";
if($row['bo_table']=='shop') $icon = "<i class='fa fa-book'></i> ";
$wrTable = $g5['write_prefix'].$row['bo_table'];
$paInfo = get_write($wrTable,$row['wr_parent']);
$wrInfo = sql_fetch(" select wr_id,wr_content,ca_name from {$wrTable} where wr_is_comment = 1 and wr_parent = '{$row['wr_parent']}' order by wr_id desc limit 0,1 ");
$sbj = "<strong>".mb_strimwidth($paInfo['wr_subject'],0,25,"…","UTF-8")."</strong>";
$con = mb_strimwidth($wrInfo['wr_content'],0,30,"…","UTF-8");
?>
	<li id="<?php echo $row['bo_table'].'-'.$paInfo['wr_id'].'-'.$wrInfo['wr_id'].'-'.$wrInfo['ca_name']?>" class="commentsLi" rel="#f6f6f6">
		<?php echo $con?>
		<div class="info"><?php echo $icon.$sbj?></div>
	</li>
	
<?php
	$j++;
		if($j>=15) break;
} ?>
</div>
<?php include_once('./_tail.php');?>
