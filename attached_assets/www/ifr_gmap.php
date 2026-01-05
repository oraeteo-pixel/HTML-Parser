<?php
include_once('./_common.php');
include_once('./head.sub.php');
?>

<div id="gmap-area">
	<div id="gmap" class="gmapMR"></div>
	<?php if(!$sect) { ?>
	<a href="<?php echo G5_URL?>/_map/" target="_top"><img src="<?php echo G5_IMG_URL?>/logo_jssrmap.png" id="logo-jssrmap" border="0" /></a>
	<?php } ?>
	<div id="gmap-search-info" class="list-group map-search-info"></div>
	<div id="gmap-search-box" class="map-search-box">
		<div class="input-group">
			<input type="text" id="gmap-address" class="form-control map-address" placeholder="주소/지명 입력 후 엔터키" />
			<span class="input-group-btn">
				<button class="btn btn-primary map-search-button" type="button" id="gmap-search-button">
					<i class="fa fa-search"></i>
				</button>
			</span>
		</div>
	</div>
	<div id="gmap-window"></div>

	<button class="btn btn-info onTooltip" id="btn-allCheck" data-toggle="tooltip" data-placement="auto bottom" title="모든 사진을 선택합니다."><i class="fa fa-check-square-o"></i></button>
	<button class="btn btn-info onTooltip" id="btn-window" data-toggle="tooltip" data-placement="auto bottom" title="사진의 정보창을 제어합니다."><i class="fa fa-toggle-down"></i></button>
	<button class="btn btn-primary onTooltip" id="btn-orgnPos" data-toggle="tooltip" data-placement="auto bottom" title="지도의 중심좌표를 초기화 합니다."><i class="fa fa-reply"></i></button>
	<a href="<?php echo G5_URL.$_SERVER['REQUEST_URI']?>" class="btn btn-warning onTooltip" id="btn-refresh" data-toggle="tooltip" data-placement="auto bottom" title="지도를 새로고침 합니다."><i class="fa fa-repeat"></i></a>
	<button class="btn btn-success onTooltip" id="btn-showHide" data-toggle="tooltip" data-placement="auto bottom" title="이 사진목록상자를 제어합니다."><i class="fa fa-sort"></i></button>
	
	<?/****?>
	<div id="gmap-wr-info" class="map-wr-info sm-none">
		<ul class="nav nav-pills" id="gmap-wr-info-menu">
			<li class="active"><a href="#"><i class="fa fa-picture-o"></i></a></li>
			<li><a href="#"><i class="fa fa-list-alt"></i></a></li>
			<li><a href="#"><i class="fa fa-users"></i></a></li>
		</ul>
		<div id="imgArray" class="imgArray">
		<?php
			$photoGrid = sql_query(" select wr_id,mb_id from {$map_table} where wr_is_comment = 0 order by wr_num limit 0,20 ");
			for($i=0;$row=sql_fetch_array($photoGrid);$i++) {
				$photos = sql_query(" select id from gpf_picasa where wr_id = '{$row['wr_id']}' and map_address != '' order by id ");
				$photosIds[$i] = "";
				for($j=0;$prow=sql_fetch_array($photos);$j++) {
					$photosIds[$i] .= "p".$prow['id']."_";
				}
				$allPhotosIds .= $photosIds[$i];
				$photoH = sql_fetch(" select thumb2 from gpf_picasa where wr_id = {$row['wr_id']} and map_address != '' order by id limit 0,1 ");
				$photosN = sql_fetch(" select count(id) as num from gpf_picasa where wr_id = {$row['wr_id']} and map_address != '' ");
				$more_photo = $photosN['num'] - 1;
				$photo_num = "";
				if($more_photo>0) $photo_num = "<button class='btn btn-warning btn-xs photoNum' rel='".$row['wr_id'].":".$photosIds[$i]."'>+".$more_photo."</button>";
				$modify = "";
				if($is_member&&$member['mb_id']==$row['mb_id']&&!G5_IS_MOBILE)
				$modify = "<a class='btn btn-success btn-xs modify' href='".G5_BBS_URL."/write.php?bo_table=map&wr_id=".$row['wr_id']."&w=u' target='_top'>수정</a>";
		?>
			<li style="background:url('<?php echo $photoH['thumb2']?>');background-position:center center;" rel="<?php echo $row['wr_id']?>:<?php echo $photosIds[$i]?>" draggable="true">
				<i class="fa fa-check-square-o fa-2x checkImg" id="chkP<?php echo $row['wr_id']?>"><!---span id="num<?php //echo $i?>"></span--></i>
				<?php echo $modify.$photo_num?>
			</li>
		<?php } ?>
		</div>
	</div>
	<?/****/?>
	<div id="gmap-wr-info2" class="map-wr-info">
		<div id="mapInfo"></div>
		<button type="button" class="btn btn-default btn-sm" id="close"><i class="fa fa-times-circle"></i></button>
		<div id="imgArray2"></div>
	</div>
	<div style="position:absolute;bottom:60px;left:300px;">
		<input type="hidden" id="popupStat" value="popupTrue" size="40">
		<input type="hidden" id="schCheckArray" size="40"><br />
		<input type="hidden" id="schCheckArray2" size="40">
	</div>
	
	<div id="photos-grid">
		<div id="imgArray" class="imgArray">
		<?php
			$photoGrid = sql_query(" select wr_id,mb_id from {$map_table} where wr_is_comment = 0 and wr_1 = 'ok' order by wr_num limit 0,15 ");
			for($i=0;$row=sql_fetch_array($photoGrid);$i++) {
				$photos = sql_query(" select id from gpf_picasa where wr_id = '{$row['wr_id']}' and map_address != '' order by id ");
				$photosIds[$i] = "";
				for($j=0;$prow=sql_fetch_array($photos);$j++) {
					$photosIds[$i] .= "p".$prow['id']."_";
				}
				$allPhotosIds .= $photosIds[$i];
				$photoH = sql_fetch(" select thumb2 from gpf_picasa where wr_id = {$row['wr_id']} and map_address != '' order by id limit 0,1 ");
				$photosN = sql_fetch(" select count(id) as num from gpf_picasa where wr_id = {$row['wr_id']} and map_address != '' ");
				$more_photo = $photosN['num'] - 1;
				$photo_num = "";
				if($more_photo>0) $photo_num = "<button class='btn btn-warning btn-xs photoNum' rel='".$row['wr_id'].":".$photosIds[$i]."'>+".$more_photo."</button>";
				$modify = "";
				if($is_member&&$member['mb_id']==$row['mb_id']&&!G5_IS_MOBILE)
				$modify = "<a class='btn btn-success btn-xs modify' href='".G5_BBS_URL."/write.php?bo_table=map&wr_id=".$row['wr_id']."&w=u' target='_top'>수정</a>";
		?>
			<li style="background:url('<?php echo $photoH['thumb2']?>');background-position:center center;" rel="<?php echo $row['wr_id']?>:<?php echo $photosIds[$i]?>" draggable="true">
				<i class="fa fa-check-square-o fa-2x checkImg" id="chkP<?php echo $row['wr_id']?>"><!---span id="num<?php //echo $i?>"></span--></i>
				<?php echo $modify.$photo_num?>
			</li>
		<?php } ?>
		</div>	
	</div>
	<?php
		$stTime = date("Y-m-d H:i:s", G5_SERVER_TIME - (24 * 3600));
		$newPost = sql_fetch(" select count(wr_id) as num from {$map_table} where wr_is_comment = 0 and wr_datetime >= '{$stTime}' ");
		$mapPost = sql_fetch(" select count(wr_id) as num from {$map_table} where wr_is_comment = 0 and wr_1 != 'ok' ");
	?>
	<?php if($is_admin=='super') { ?><a href="<?php echo G5_BBS_URL?>/board.php?bo_table=map" target="_top"><span id="mng-photos"><?php echo $newPost['num']?> / <?php echo $mapPost['num']?></span></a><?php } ?>
</div>

<?php
include_once('./tail.sub.php');
?>