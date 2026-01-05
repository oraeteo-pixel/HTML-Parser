<?php
if($bo_table=='map') {
include_once('./_common.php');
include_once('./head.sub.php');
}
?>

<div id="gmap-area">
	<div id="gmap" class="gmapMR"></div>
	<?php if($_SERVER['REDIRECT_URL']=='/') { ?>
	<a href="<?php echo G5_URL?>/_map/"><img src="<?php echo G5_IMG_URL?>/logo_jssrmap.png" id="logo-jssrmap" border="0" /></a>
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
	<div id='btn-box'>
		<?php /*if(!$map_id&&!$wr_id) { ?>
		<li><button class="btn btn-info onTooltip" id="btn-allCheck" data-toggle="tooltip" data-placement="auto bottom" title="모든 사진을 선택합니다."><i class="fa fa-check-square-o"></i></button></li>
		<?php }*/ ?>
		<?php if(!$map_id&&!$wr_id&&!$bo_table) { ?>
		<li><button class="btn btn-info onTooltip" id="btn-window" data-toggle="tooltip" data-placement="auto bottom" title="사진의 정보창을 제어합니다."><i class="fa fa-toggle-down"></i></button></li>
		<li><button class="btn btn-primary onTooltip" id="btn-orgnPos" data-toggle="tooltip" data-placement="auto bottom" title="지도의 중심좌표를 초기화 합니다."><i class="fa fa-reply"></i></button></li>
		<li><button class="btn btn-warning onTooltip" id="btn-refresh" data-toggle="tooltip" data-placement="auto bottom" title="지도를 새로고침 합니다."><i class="fa fa-repeat"></i></button></li>
		<?php } else if($wr_id) { ?>
		<li><a class="btn btn-warning onTooltip" href="<?php echo $_SERVER['REQUEST_URI']?>" data-toggle="tooltip" data-placement="auto bottom" title="지도를 새로고침 합니다."><i class="fa fa-repeat"></i></a></li>
		<?php } ?>
		<li><button class="btn btn-success onTooltip" id="btn-showHide" data-toggle="tooltip" data-placement="auto bottom" title="이 사진목록상자를 제어합니다."><i class="fa fa-sort"></i></button></li>
	</div>

	<div id="photos-grid2" class="<?php if($map_id) { ?>mapId<?php } else { ?>mapIdN<?php } ?>">
		<?php if(!$map_id) { ?>
		<button type="button" class="btn btn-default btn-sm" id="close"><i class="fa fa-times-circle"></i></button>
		<?php } ?>
		<div id="mapTitle"></div>
		<div id="imgArray2"></div>
	</div>

	<div id="photos-grid"<?php //if(!$wr_id) { ?> class="paddT50"<?php //} ?>>
		<button type="button" class="btn btn-danger btn-sm" id="btn-unMapPos">지도위치 취소하기</button>
		<div id="imgArray" class="imgArray">
		<?php if($bo_table) {
//			if($wr_id>0)
			$photos = sql_query(" select * from gpf_picasa where wr_id = '{$wr_id}' and mb_id = '{$member['mb_id']}' and bo_table = 'map' order by map_address desc, id ");
			$photosIds = "";
			for($i=0;$row=sql_fetch_array($photos);$i++) {
				$checkedImg = "";
				if($row['map_address']!='') {
					$photosIds .= "p".$row['id']."_";
					$checkedImg = '<i class="fa fa-check-square-o fa-2x checkedImg"></i>';
				}
				$sMP = sql_query(" select id from gpf_picasa where map_address = '{$row['map_address']}' and wr_id = '{$wr_id}' order by id ");
				$sMPn = sql_fetch(" select count(id) as num from gpf_picasa where map_address = '{$row['map_address']}' and map_address != '' and wr_id = '{$wr_id}' ");
				for($s=0;$srow=sql_fetch_array($sMP);$s++) $sMPs[$i] .= $srow['id'].'_';
				$sMPss = explode('_',$sMPs[$i]);
		?>
			<li style="background:url('<?php echo $row['thumb2']?>');background-position:center center;" id="p<?php echo $row['id']?>">
				<?php //echo $checkedImg?>
				<?php if($row['map_address']=='') { ?>
				<span class="unMapPos"> 위치미지정 </span>
				<?php } ?>
				<i class="fa fa-check-square-o fa-2x checkImg" id="chkp<?php echo $row['id']?>"></i>
				<?php
					if($sMPn['num']>1) {
						$last = $sMPn['num']-1;
						if($row['id']==$sMPss[0]) $sMPC = "<div class='sMP sMP1'><i class='fa fa-map-marker'></i> 동일위치</div>";
						else if($row['id']==$sMPss[$last]) $sMPC = "<div class='sMP sMP3'> : ".$sMPn['num']." <i class='fa fa-map-marker'></i></div>";
						else $sMPC = "<div class='sMP sMP2'>&nbsp;</div>";
						echo $sMPC;
					}
				?>
			</li>
		<?php } } else if($map_id) {
			$photos = sql_query(" select * from gpf_picasa where wr_id = '{$map_id}' and bo_table = 'map' order by map_address desc, id ");
			$photosIds = "";
			for($i=0;$row=sql_fetch_array($photos);$i++) {
				if($row['map_address']!='')	$photosIds .= "p".$row['id']."_";
				$sMP = sql_query(" select id from gpf_picasa where map_address = '{$row['map_address']}' and wr_id = '{$map_id}' order by id ");
				$sMPn = sql_fetch(" select count(id) as num from gpf_picasa where map_address = '{$row['map_address']}' and map_address != '' and wr_id = '{$map_id}' ");
				for($s=0;$srow=sql_fetch_array($sMP);$s++) $sMPs[$i] .= $srow['id'].'_';
				$sMPss = explode('_',$sMPs[$i]);
		?>
			<li style="background:url('<?php echo $row['thumb2']?>');background-position:center center;"
			rel="<?php echo $row['wr_id']?>:<?php echo $photosIds?>" id="p<?php echo $row['id']?>">
				<?php if($row['map_address']) { ?>
				<i class="fa fa-check-square-o fa-2x checkImg2" id="chkp<?php echo $row['id']?>"></i>
				<?php } else { ?>
				<span class="unMapPos"> 위치미지정</span>
				<?php } ?>
				<?php
					if($sMPn['num']>1) {
						$last = $sMPn['num']-1;
						if($row['id']==$sMPss[0]) $sMPC = "<div class='sMP sMP1'><i class='fa fa-map-marker'></i> 동일위치</div>";
						else if($row['id']==$sMPss[$last]) $sMPC = "<div class='sMP sMP3'> : ".$sMPn['num']." <i class='fa fa-map-marker'></i></div>";
						else $sMPC = "<div class='sMP sMP2'>&nbsp;</div>";
						echo $sMPC;
					}
				?>
			</li>
		<?php } ?>
			<?php if($member['mb_id']==$mapWrInfo['mb_id']) { ?>
			<div class="cl-bo padd10 C999 fs-09"><i class="fa fa-info-circle"></i> 위치미지정 사진은 <?php echo $mapWrMb['mb_nick']?>님에게만 보입니다.</div>
			<?php } ?>
		<?php } else {
			$is_uId = "";
			if($uId) $is_uId = " and mb_id = '{$uId}'";
			$photoGrid = sql_query(" select wr_id,mb_id from {$map_table} where wr_is_comment = 0 {$is_uId} order by wr_num limit 0,15 ");
//			$photoGrid = sql_query(" select wr_id,mb_id from {$map_table} where wr_is_comment = 0 and wr_1 = 'ok' {$is_uId} order by wr_num limit 0,15 ");
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
			<li style="background:url('<?php echo $photoH['thumb2']?>');background-position:center center;"
			rel="<?php echo $row['wr_id']?>:<?php echo $photosIds?>" id="<?php echo $row['wr_id']?>">
				<i class="fa fa-check-square-o fa-2x checkImg" id="chkP<?php echo $row['wr_id']?>"></i>
				<?php echo $modify.$photo_num?>
			</li>
		<?php } } ?>
		</div>
		<?php if($bo_table=='map') { ?>
		<div id="guide-txt">
			<strong><i class="fa fa-map-marker"></i> 지도에 사진등록 신청하기 안내</strong>
			<ol>
				<li>하단의 <img src="<?php echo G5_IMG_URL?>/btn_upphoto.png" align="absmiddle">를 클릭하여 사진(들)을 업로드합니다. (사진목록상자에 업로드한 사진들이 정렬됨)</li>
				<li>지도에서 원하는 위치를 클릭합니다. (마커와 안내창이 생김)</li>
				<li>지도에 위치등록을 하고자 하는 사진(들)을 체크합니다. (동일장소에 여러 장 동시등록 가능, 수정 시 위치변경 가능)</li>
				<li>등록하고자 하는 위치의 정보창에 있는 <button class="btn btn-primary btn-xs"><i class="fa fa-map-marker"></i> 이 지도 위치에 사진 올리기</button>를 클릭하여 위치등록을 합니다.</li>
				<li>지도 좌측 하단의 검색폼을 이용하여 위치를 찾을 수도 있습니다.</li>
				<li>각 사진정보를 입력한 후 맨 하단의 <a type="button" class="btn btn-success btn-xs">지도에 사진등록 신청하기</a>를 클릭하면 사진등록 신청이 마무리됩니다.</li>
			</ol>
		</div>
		<?php } ?>
	</div>
	<?php
		$stTime = date("Y-m-d H:i:s", G5_SERVER_TIME - (24 * 3600));
		$newPost = sql_fetch(" select count(wr_id) as num from {$map_table} where wr_is_comment = 0 and wr_datetime >= '{$stTime}' ");
		$mapPost = sql_fetch(" select count(wr_id) as num from {$map_table} where wr_is_comment = 0 and wr_1 != 'ok' ");
	?>
	<?php if($is_admin=='super') { ?><a href="<?php echo G5_BBS_URL?>/board.php?bo_table=map" target="_top"><span id="mng-photos"><?php echo $newPost['num']?> / <?php echo $mapPost['num']?></span></a><?php } ?>

	<div style="position:absolute;bottom:60px;left:300px;">
<?php
//if($is_admin&&($map_id||$wr_id))
//$type = "text";
//else
$type = "hidden";
?>
		<input type="<?php echo $type?>" id="mapPos" size="50">
		<input type="<?php echo $type?>" id="chkPhotos" size="50">
		<input type="<?php echo $type?>" id="schCheckArray" size="40">
		<input type="<?php echo $type?>" id="schCheckArray2" value="<?php echo $photosIds?>" size="40">
		<input type="<?php echo $type?>" id="popupStat" value="popupTrue">
	</div>
	
</div>

<?php
if($bo_table=='map') {
include_once('./tail.sub.php');
}
?>