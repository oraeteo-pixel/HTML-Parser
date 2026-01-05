<?php include_once('./_common.php');?>
		<?php
//		$uniqId = sql_query(" select Distinct mb_id from {$square_table} where wr_is_comment = 0 order by wr_id ");
		$limit = "";
		if(G5_IS_MOBILE) $limit = " limit 0,3";
		$uniqId = sql_query(" select mb_id, max(wr_id) as maxWrId from {$square_table} where wr_is_comment = 0 group by mb_id order by maxWrId desc {$limit} ");
		for($i=0;$mrow=sql_fetch_array($uniqId);$i++) {
		?>
			<div class="sectList">

		<?php
			$sqMb = sql_query(" select * from {$square_table} where wr_is_comment = 0 and mb_id = '{$mrow['mb_id']}' order by wr_num limit 0,5 ");
			for($j=0;$row=sql_fetch_array($sqMb);$j++) {

			$sbj = mb_strimwidth($row['wr_subject'],0,60,"…","UTF-8");
			$wr_content = preg_replace("/<(.*?)\>/","",$row['wr_content']);
			$wr_content = preg_replace("/&nbsp;/","",$wr_content);
//			$square_con = mb_strimwidth($wr_content,0,150,"…","UTF-8");
			$con = explode("[Img:",$wr_content);
			$cnt = count($con);
			$wrContent = $con[0];
			$photosGrid = '';
			for($i=1;$i<$cnt;$i++)
			{
				$con2 = explode("]",$con[$i]);
				$pId = $con2[0];
				$pCode = "[Img:".$pId."]";
				$pInfo = sql_fetch(" select thumb2,thumb2_width from gpf_picasa where id = '{$pId}' ");
				$conPart = "[Img:".$con[$i];
				$wrContent .= str_replace($pCode,'',$conPart);
				$photosGrid .= "<li style=\"background:url('".$pInfo['thumb2']."');width:".$pInfo['thumb2_width']."px;height:80px;background-position:center center;')\"></li>";
			}
			$square_con = mb_strimwidth($wrContent,0,130,"…","UTF-8");
			$rowDatetime10 = substr($row['wr_datetime'],0,10);
			if($rowDatetime10==G5_TIME_YMD)
				$rowDatetime = substr($row['wr_datetime'],11,8);
			else
				$rowDatetime = $rowDatetime10;
			$commentNum = "";
			if($row['wr_comment']>0) $commentNum = "&nbsp; <i class='fa fa-comment'></i> <span class='comment-num'>".$row['wr_comment']."</span>";
		?>
			<?php if($j==0) { ?>
				<h1>
					<a href="<?php echo G5_URL?>/_square/?square_id=<?php echo $row['wr_id']?>"><?php echo $sbj.$commentNum?></a>
				</h1>
				<div class="con">
					<strong class="name"><?php echo $row['wr_name']?></strong>
					<a class="btn btn-default btn-xs" href="javascript:;" onclick="window.open('<?php echo G5_BBS_URL?>/memo_form.php?me_recv_mb_id=<?php echo $row['mb_id']?>','name','resizable=no,width=550,height=500,status=no,scrollbars=yes,menubar=no');return false"><i class="fa fa-envelope-o"></i> 쪽지</a>
					<span class="date"><?php echo $rowDatetime;?></span> &nbsp; <span class="wrHit round5"><?php echo number_format($row['wr_hit'])?></span><br />
					<?php echo $square_con?>
				</div>
				<div class="photosGrid"><?php  echo $photosGrid?></div>
				<?php } else { ?>
				<div class="moreSbj">
					<a href="<?php echo G5_URL?>/_square/?square_id=<?php echo $row['wr_id']?>">
						<span class="date"><?php echo $rowDatetime;?></span> <span class="sbj"><?php echo $sbj.$commentNum?></span>
					</a>
				</div>
				<?php } ?>
			<?php } ?>

			</div>
		<?php } ?>