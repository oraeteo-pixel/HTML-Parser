<?php include_once('./_common.php');?>
<div id="menuCon">
<?php if($menu=="square") { ?>
	<h2><a href="<?php echo G5_URL?>/_square/"><i class="fa fa-th-large"></i> 오리알터광장</a></h2>
	<a id="btnWrite" class="btn btn-primary btn-sm" href="<?php echo G5_BBS_URL?>/write.php?bo_table=square"<?php if($member['mb_level']<3) { ?> disabled="disabled"<?php } ?>><i class="fa fa-pencil"></i> 광장 글쓰기</a>
	<div id="mUser" class="round5">
		<?php
//		$uniqId = sql_query(" select Distinct mb_id from {$square_table} where wr_is_comment = 0 order by wr_num ");
		$uniqId = sql_query(" select mb_id, max(wr_id) as maxWrId from {$square_table} where wr_is_comment = 0 group by mb_id order by maxWrId desc ");
		for($u=0;$row=sql_fetch_array($uniqId);$u++) {
			$uInfo = get_member($row['mb_id']);
			$selected = "";
			if($uId==$row['mb_id']||$squareWrInfo['mb_id']==$row['mb_id'])
				$selected = " selected";
		?>
		<li><a class="round5<?php echo $selected?>" href="<?php echo G5_URL?>/_square/?uId=<?php echo $row['mb_id']?>"><?php echo $uInfo['mb_nick']?></a></li>
		<?php } ?>
	</div>
<?php } ?>

<?php if($menu=="map") { ?>
	<h2><a href="<?php echo G5_URL?>/_map/"><i class="fa fa-map-marker"></i> 증산순례지도</a></h2>
	<?php if(!G5_IS_MOBILE) { ?>
	<a id="btnWrite" class="btn btn-primary btn-sm" href="<?php echo G5_BBS_URL?>/write.php?bo_table=map"<?php if($member['mb_level']<3) { ?> disabled="disabled"<?php } ?>><i class="fa fa-pencil"></i> 지도 올리기</a>
	<?php } ?>
	<div id="mUser" class="round5">
		<?php
//		$uniqId = sql_query(" select Distinct mb_id from {$map_table} where wr_is_comment = 0 and wr_1 = 'ok' order by wr_num ");
		$uniqId = sql_query(" select mb_id, max(wr_id) as maxWrId from {$map_table} where wr_is_comment = 0 group by mb_id order by maxWrId desc ");
		for($u=0;$row=sql_fetch_array($uniqId);$u++) {
			$uInfo = get_member($row['mb_id']);
			$selected = "";
			if($uId==$row['mb_id']||$mapWrInfo['mb_id']==$row['mb_id'])
				$selected = " selected";
		?>
		<li><a class="round5<?php echo $selected?>" href="<?php echo G5_URL?>/_map/?uId=<?php echo $row['mb_id']?>"><?php echo $uInfo['mb_nick']?></a></li>
		<?php } ?>
	</div>
<?php } ?>

<?php if($menu=="madang") { ?>
	<h2><a href="<?php echo G5_URL?>/_madang/"><i class="fa fa-square-o"></i> 열린마당</a></h2>
	<a id="btnWrite" class="btn btn-primary btn-sm" href="<?php echo G5_BBS_URL?>/write.php?bo_table=madang"<?php if($member['mb_level']<2) { ?> disabled="disabled"<?php } ?>><i class="fa fa-pencil"></i> 마당 글쓰기</a>
	<div id="mMadang"<?php if(!G5_IS_MOBILE) { ?> class="mMadang"<?php } ?>>
		<div id="mUser" class="round5">
		<?php
//		$uniqId = sql_query(" select Distinct mb_id from {$madang_table} where wr_is_comment = 0 order by wr_num ");
		$uniqId = sql_query(" select mb_id, max(wr_id) as maxWrId from {$madang_table} where wr_is_comment = 0 group by mb_id order by maxWrId desc ");
		for($u=0;$row=sql_fetch_array($uniqId);$u++) {
			$uInfo = get_member($row['mb_id']);
			$selected = "";
			if($uId==$row['mb_id']||$mdWrInfo['mb_id']==$row['mb_id'])
				$selected = " selected";
		?>
			<li><a class="round5<?php echo $selected?>" href="<?php echo G5_URL?>/_madang/?uId=<?php echo $row['mb_id']?>"><?php echo $uInfo['mb_nick']?></a></li>
		<?php } ?>
		</div>
	</div>
	<div id="mNotice" class="round5 <?php if(G5_IS_MOBILE) { ?>mNoticeMo<?php } else { ?>mNoticeAbs<?php } ?>">
		<h3><i class="fa fa-bullhorn"></i> 공지</h3>
		<?php
			$noSql = sql_query(" select * from {$notice_table} where wr_is_comment = 0 order by wr_num limit 0,5 ");
			for($n=0;$row=sql_fetch_array($noSql);$n++) {
			$rowDatetime10 = substr($row['wr_datetime'],0,10);
			if($rowDatetime10==G5_TIME_YMD)
				$rowDatetime = "<strong>".substr($row['wr_datetime'],11,5)."</strong>";
			else
				$rowDatetime = substr($row['wr_datetime'],5,5);
			$sbj = mb_strimwidth($row['wr_subject'],0,20,"…","UTF-8");
			$noticeNew = "";
			if($row['wr_datetime']>=date("Y-m-d H:i:s", G5_SERVER_TIME - (24 * 3600)))
				$noticeNew = " <span class='alert-num fs-08'>N</span>";
		?>
		<li><a class="round5" href="<?php echo G5_URL?>/_notice/?no_id=<?php echo $row['wr_id']?>"><span class="date"><?php echo $rowDatetime?></span> <?php echo $sbj.$noticeNew?></a></li>
		<?php } ?>
		<?php if($member['mb_level']>=8) { ?>
		<a id="btnNotice" class="btn btn-primary btn-xs" href="<?php echo G5_BBS_URL?>/write.php?bo_table=notice"><i class="fa fa-pencil"></i></a>
		<?php } ?>
	</div>
<?php } ?>

<?php if($menu=="ebook") { ?>
	<h2><a href="<?php echo G5_URL?>/_ebook/"><i class="fa fa-university"></i> 현무경 대학공부</a></h2>
	<a id="btnWrite" class="btn btn-primary btn-sm" href="<?php echo G5_BBS_URL?>/write.php?bo_table=ebook"<?php if($member['mb_level']<8) { ?> disabled="disabled"<?php } ?>><i class="fa fa-pencil"></i> 대학공부 글쓰기</a>
	<?/****?>
	<div id="mUser" class="round5">
		<?php
//		$uniqId = sql_query(" select Distinct mb_id from {$square_table} where wr_is_comment = 0 order by wr_num ");
		$uniqId = sql_query(" select mb_id, max(wr_id) as maxWrId from {$ebook_table} where wr_is_comment = 0 group by mb_id order by maxWrId desc ");
		for($u=0;$row=sql_fetch_array($uniqId);$u++) {
			$uInfo = get_member($row['mb_id']);
			$selected = "";
			if($uId==$row['mb_id']||$ebWrInfo['mb_id']==$row['mb_id'])
				$selected = " selected";
		?>
		<li><a class="round5<?php echo $selected?>" href="<?php echo G5_URL?>/_ebook/?uId=<?php echo $row['mb_id']?>"><?php echo $uInfo['mb_nick']?></a></li>
		<?php } ?>
	</div>
	<?/****/?>
<?php } ?>

<?php if($menu=="shop") { ?>
	<h2><a href="<?php echo G5_URL?>/_shop/"><i class="fa fa-graduation-cap"></i> 관왕</a></h2>
	<a id="btnWrite" class="btn btn-primary btn-sm" href="<?php echo G5_BBS_URL?>/write.php?bo_table=shop"<?php if($member['mb_level']<8) { ?> disabled="disabled"<?php } ?>><i class="fa fa-pencil"></i> 관왕 글쓰기</a>
	<?/****?>
	<div id="mUser" class="round5">
		<?php
//		$uniqId = sql_query(" select Distinct mb_id from {$square_table} where wr_is_comment = 0 order by wr_num ");
		$uniqId = sql_query(" select mb_id, max(wr_id) as maxWrId from {$shop_table} where wr_is_comment = 0 group by mb_id order by maxWrId desc ");
		for($u=0;$row=sql_fetch_array($uniqId);$u++) {
			$uInfo = get_member($row['mb_id']);
			$selected = "";
			if($uId==$row['mb_id']||$shWrInfo['mb_id']==$row['mb_id'])
				$selected = " selected";
		?>
		<li><a class="round5<?php echo $selected?>" href="<?php echo G5_URL?>/_shop/?uId=<?php echo $row['mb_id']?>"><?php echo $uInfo['mb_nick']?></a></li>
		<?php } ?>
	</div>
	<?/****/?>
<?php } ?>

<?php if($menu=="calendar") { ?>
	<h2><a href="<?php echo G5_URL?>/_calendar/?cal=hw"><i class="fa fa-calendar"></i> 황극력</a></h2>
	<a id="btnWrite" class="btn btn-primary btn-sm" href="<?php echo G5_BBS_URL?>/write.php?bo_table=calendar"<?php if($member['mb_level']<8) { ?> disabled="disabled"<?php } ?>><i class="fa fa-pencil"></i> 황극력 글쓰기</a>
	<?/****?>
	<div id="mUser" class="round5">
		<?php
//		$uniqId = sql_query(" select Distinct mb_id from {$square_table} where wr_is_comment = 0 order by wr_num ");
		$uniqId = sql_query(" select mb_id, max(wr_id) as maxWrId from {$calendar_table} where wr_is_comment = 0 group by mb_id order by maxWrId desc ");
		for($u=0;$row=sql_fetch_array($uniqId);$u++) {
			$uInfo = get_member($row['mb_id']);
			$selected = "";
			if($uId==$row['mb_id']||$calWrInfo['mb_id']==$row['mb_id'])
				$selected = " selected";
		?>
		<li><a class="round5<?php echo $selected?>" href="<?php echo G5_URL?>/_calendar/?uId=<?php echo $row['mb_id']?>"><?php echo $uInfo['mb_nick']?></a></li>
		<?php } ?>
	</div>
	<?/****/?>
<?php } ?>


</div>