<?php
include_once('./_common.php');
if($cateName||$pageNum) { //카테고리 목록을 클릭했을 때 불러 옴
$rows = 5; ///페이지당 글수
$prows = 5; ///출력 페이지수
if(!$pageNum&&$cateNum<1) {
	echo '<strong><i class="fa fa-th-list"></i> '.$cateName.'</strong>';
	echo "<div class='cl-bo padd10 txtC C999'>이 카테고리에는 게시글이 없습니다.</div>";
} else {
$thisId = $maxId;
$caName = $cateName;
if($pageNum) {
	$thisId = $getId;
	$caName = $cate;
//	$mbId = $getMb;
}
$is_caName = "and ca_name = '{$caName}'";
$ca_url = "&amp;ebCate=".urldecode($caName);
$caTitle = $caName;
if($caName=='전체'||!$caName) {
	$is_caName = "";
	$ca_url = "";
	$caTitle = "전체";
}
	echo '<strong><i class="fa fa-th-list"></i> '.$caTitle.'</strong>';
$is_where = "wr_is_comment = 0 {$is_caName}";
$pNextNum = sql_fetch(" select count(wr_id) as num from {$ebook_table} where {$is_where} and wr_id >= '{$thisId}' ");
$curPage = ceil($pNextNum['num']/$rows);	
if($pageNum) $curPage = $pageNum;
$begin = ($curPage-1)*$rows;
$ebookCate = sql_query(" select * from {$ebook_table} where {$is_where} order by wr_num limit {$begin},{$rows} ");
for($i=0;$row=sql_fetch_array($ebookCate);$i++) {
	$sbj = mb_strimwidth($row['wr_subject'],0,30,"…","UTF-8");
	$cmt = "";
	if($row['wr_comment']>0) $cmt = "<span class='comment-num'>".$row['wr_comment']."</span>";
	$rowDatetime10 = substr($row['wr_datetime'],0,10);
	if($rowDatetime10==G5_TIME_YMD)
		$rowDatetime = substr($row['wr_datetime'],11,8);
	else
		$rowDatetime = $rowDatetime10;
	$selected = "";
//	if($thisId==$row['wr_id']) $selected = " class='selected round5'";
?>
<li>
	<a href="<?php echo G5_URL?>/_ebook/?ebook_id=<?php echo $row['wr_id'].$ca_url?>"<?php echo $selected?>>
		<span class="date"><?php echo $rowDatetime?></span> <?php echo $sbj?> <i class="fa fa-comments"></i> <?php echo $cmt?>
	</a>
</li>
<?php } ?>
<div id="ebCateList" class="pageBox">
<?php
if($caName=='전체')
	echo getPaging($rows,$prows,$ebook_table,'A',$thisId,'','ebCateList','');
else
	echo getPaging($rows,$prows,$ebook_table,'AD',$thisId,'','ebCateList',$caName);
?>
</div>
<?php } } ?>