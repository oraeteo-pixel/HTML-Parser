<?php
include_once('./_common.php');
?>
<?php
		$mdSql = sql_query(" select * from {$madang_table} where wr_is_comment = 0 order by wr_num limit 0,10 ");
		for($m=0;$row=sql_fetch_array($mdSql);$m++) {
		$sbj = mb_strimwidth($row['wr_subject'],0,30,"…","UTF-8");
		$name = mb_strimwidth($row['wr_name'],0,12,"…","UTF-8");
		$rowDatetime10 = substr($row['wr_datetime'],0,10);
		if($rowDatetime10==G5_TIME_YMD)
			$rowDatetime = "<strong>".substr($row['wr_datetime'],11,5)."</strong>";
		else
			$rowDatetime = substr($row['wr_datetime'],5,5);
		$cmtNum = "";
		if($row['wr_comment']>0) $cmtNum = " <span class='cmt'><i class='fa fa-comment'></i> <span class='comment-num fs-08'>".$row['wr_comment']."</span></span>";
		$nameClass = "name";
		if($row['wr_datetime']>=date("Y-m-d H:i:s", G5_SERVER_TIME - (24 * 3600)))
			$nameClass = "nameNew";
?>
		<li>
			<a href="<?php echo G5_URL?>/_madang/?md_id=<?php echo $row['wr_id']?>"><span class="date"><?php echo $rowDatetime?></span> <span class="<?php echo $nameClass?> round5"><?php echo $name?></span> <?php echo $sbj.$cmtNum?></a>
		</li>
<?php } ?>