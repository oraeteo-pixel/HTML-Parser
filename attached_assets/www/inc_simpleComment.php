<?php
include_once('./_common.php');

	$simpleSql = sql_query(" select * from {$square_table} where wr_is_comment = 0 and ca_name = '열린마당' order by wr_num limit 0,5 ");
	for($i=0;$row=sql_fetch_array($simpleSql);$i++) {
	$name = mb_strimwidth($row['wr_name'],0,12,"…","UTF-8");
	$rowDatetime10 = substr($row['wr_datetime'],0,10);
	if($rowDatetime10==G5_TIME_YMD) $rowDatetime = substr($row['wr_datetime'],11,5);
	else $rowDatetime = substr($row['wr_datetime'],5,5);
?>
				<li id="sC<?php echo $row['wr_id']?>">
					<span class="date"><?php echo $rowDatetime?></span>
					<span class="name"><?php echo $name?></span>
					<?php echo $row['wr_subject']?>
					<?php if($member['mb_id']==$row['mb_id']) { ?>
					<div class="toolBox round5" id="sC<?php echo $row['wr_id']?>">
						<i class="fa fa-trash-o"></i> 삭제 &nbsp;
						<i class="fa fa-eraser"></i> 수정
					</div>
					<?php } ?>
				</li>
<?php } ?>
