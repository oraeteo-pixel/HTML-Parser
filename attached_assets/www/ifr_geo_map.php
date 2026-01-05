<?php
include_once('./_common.php');
include_once('./head.sub.php');
?>

<div id="geo-map-area">
	<div id="geo-map" class="gmapMR"></div>
	<div id="geo-map-window">
	</div>
	<?php if($w=='u') { ?>
	<button class="btn btn-info onTooltip" id="btn-windowGeo" data-toggle="tooltip" data-placement="auto bottom" title="등록된 사진의 정보창을 제어합니다."><i class="fa fa-toggle-down"></i></button>
	<?php } ?>
	<a href="<?php echo G5_URL.$_SERVER['REQUEST_URI']?>" class="btn btn-warning onTooltip" id="btn-refresh" data-toggle="tooltip" data-placement="auto bottom" title="지도를 새로고침 합니다."><i class="fa fa-repeat"></i></a>
	<button class="btn btn-success onTooltip" id="btn-showHide" data-toggle="tooltip" data-placement="auto bottom" title="이 사진목록상자를 제어합니다."><i class="fa fa-sort"></i></button>

	<?/****?>
	<div id="geo-map-wr-info" class="map-wr-info sm-none">
		<div id="imgArrayGeo" class="imgArray">
		<?php
		$mapInfo = get_write($map_table,$map_id);
		$photosN = sql_fetch(" select count(id) as num from gpf_picasa where wr_id = '{$map_id}' and map_address = '' order by id ");
		$photos = sql_query(" select * from gpf_picasa where wr_id = '{$map_id}' order by id ");
		$photosIds = "";
		for($i=0;$row=sql_fetch_array($photos);$i++) {
			if($row['map_address']!='') {
				$photosIds .= "p".$row['id']."_";
				$checkedImg = '<i class="fa fa-check-square-o fa-2x checkedImg"></i>';
			}
			else {
				$photosIdsN .= "p".$row['id']."_";
				$checkedImg = "";
			}
			$sbj = mb_strimwidth($mapInfo['wr_subject'],0,30,"…","UTF-8");
			if($i==0) {
				if($w=='u') echo "<div id='mapInfo'>".$sbj."</div>";
				else echo "<div id='mapInfo'>&nbsp;</div>";
			}
			$modify = "";
			if($is_member&&$member['mb_id']==$row['mb_id']&&!$w&&!G5_IS_MOBILE)
			$modify = "<a class='btn btn-success btn-xs modify' href='".G5_BBS_URL."/write.php?bo_table=map&wr_id=".$map_id."&w=u' target='_top'>수정</a>";
		?>
			<li style="background:url('<?php echo $row['thumb2']?>');background-position:center center;" id="p<?php echo $row['id']?>" draggable="true">
				<?php if($w=='u') echo $checkedImg?>
				<i class="fa fa-check-square-o fa-2x checkImg" id="chkp<?php echo $row['id']?>"></i>
				<?php echo $modify?>
			</li>
		<?php } ?>
		</div>
		<?php if(!$map_id||$w=='u') { ?>
		<ul id="guide-txt">
			<li><i class="fa fa-map-marker"></i> 지도에 사진 등록하기
				<ol>
					<li>하단의 <img src="<?php echo G5_IMG_URL?>/btn_upphoto.png" align="absmiddle">를 클릭하여 사진(들)을 업로드합니다. (사진목록상자에 업로드한 사진들이 정렬됨)</li>
					<li>지도에 위치등록을 하고자 하는 사진(들)을 체크합니다. (동일장소에 여러 장 동시등록 가능, 수정 시 위치변경 가능)</li>
					<li>등록하고자 하는 위치의 정보창에 있는 <button class="btn btn-primary btn-xs"><i class="fa fa-map-marker"></i> 이 지도 위치에 사진 올리기</button> 버튼을 클릭하여 위치등록을 합니다.</li>
					<li>지도 좌측 하단의 검색폼을 이용하여 위치를 찾을 수도 있습니다.</li>
				</ol>
			</li>
		</ul>
		<?php } ?>
	</div>
	<?/****/?>
	<div id="geo-map-windowC"></div>
	<div id="geo-map-search-info" class="list-group map-search-info"></div>
	<div id="geo-map-search-box" class="map-search-box">
		<div class="input-group">
			<input type="text" id="geo-map-address" class="form-control map-address" placeholder="주소/지명 입력 후 엔터키" />
			<span class="input-group-btn">
				<button class="btn btn-primary map-search-button" type="button" id="geo-map-search-button">
					<i class="fa fa-search"></i>
				</button>
			</span>
		</div>
	</div>
	
	<div id="photos-grid">
		<div id="imgArrayGeo" class="imgArray">
		<?php
		$mapInfo = get_write($map_table,$map_id);
		$photosN = sql_fetch(" select count(id) as num from gpf_picasa where wr_id = '{$map_id}' and map_address = '' order by id ");
		$photos = sql_query(" select * from gpf_picasa where wr_id = '{$map_id}' order by id ");
		$photosIds = "";
		for($i=0;$row=sql_fetch_array($photos);$i++) {
			if($row['map_address']!='') {
				$photosIds .= "p".$row['id']."_";
				$checkedImg = '<i class="fa fa-check-square-o fa-2x checkedImg"></i>';
			}
			else {
				$photosIdsN .= "p".$row['id']."_";
				$checkedImg = "";
			}
			$modify = "";
			if($is_member&&$member['mb_id']==$row['mb_id']&&!$w&&!G5_IS_MOBILE)
			$modify = "<a class='btn btn-success btn-xs modify' href='".G5_BBS_URL."/write.php?bo_table=map&wr_id=".$map_id."&w=u' target='_top'>수정</a>";
		?>
			<li style="background:url('<?php echo $row['thumb2']?>');background-position:center center;" id="p<?php echo $row['id']?>" draggable="true">
				<?php echo $checkedImg?>
				<i class="fa fa-check-square-o fa-2x checkImg" id="chkp<?php echo $row['id']?>"></i>
				<?php echo $modify?>
			</li>
		<?php } ?>
		</div>
		<?php if(!$map_id||$w=='u') { ?>
		<div id="guide-txt">
			<strong><i class="fa fa-map-marker"></i> 지도에 사진등록 신청하기 안내</strong>
			<ol>
				<li>하단의 <img src="<?php echo G5_IMG_URL?>/btn_upphoto.png" align="absmiddle">를 클릭하여 사진(들)을 업로드합니다. (사진목록상자에 업로드한 사진들이 정렬됨)</li>
				<li>지도에 위치등록을 하고자 하는 사진(들)을 체크합니다. (동일장소에 여러 장 동시등록 가능, 수정 시 위치변경 가능)</li>
				<li>등록하고자 하는 위치의 정보창에 있는 <button class="btn btn-primary btn-xs"><i class="fa fa-map-marker"></i> 이 지도 위치에 사진 올리기</button>를 클릭하여 위치등록을 합니다.</li>
				<li>지도 좌측 하단의 검색폼을 이용하여 위치를 찾을 수도 있습니다.</li>
				<li>각 사진정보를 입력한 후 맨 하단의 <a type="button" class="btn btn-success btn-xs">지도에 사진등록 신청하기</a>를 클릭하면 사진등록 신청이 마무리됩니다.</li>
			</ol>
		</div>
		<?php } ?>
	</div>
	
	<div style="position:absolute;bottom:60px;left:300px;">
		<input type="hidden" id="chkedPhotos" value="<?php echo $photosIds?>">
		<input type="hidden" id="chkedPhotosN" value="<?php echo $photosIdsN?>">
		<input type="hidden" id="mapPos" size="50">
		<input type="hidden" id="chkPhotos" size="50">
		<input type="hidden" id="schCheckArray" size="40">
		<input type="hidden" id="schCheckArray2" value="<?php echo $photosIds?>" size="40">
		<input type="hidden" id="popupStat" value="popupTrue" size="40">
	</div>
</div>

<script>

$(document).ready(function(){
    $("#geo-map").goMap({
<?php
	$photosN = sql_fetch(" select count(id) as num from gpf_picasa where wr_id = '{$map_id}' and map_address != '' ");
	$mapInfo = get_write($map_table,$map_id);
	$sbj = mb_strimwidth($mapInfo['wr_subject'],0,30,"…","UTF-8");
	if($photosN['num']>0) {
?>
		markers: [
<?php
		$photos = sql_query(" select * from gpf_picasa where wr_id = '{$map_id}' and map_address != '' order by id ");
		for($i=0;$row=sql_fetch_array($photos);$i++) {
			$pId = 'p'.$row['id'];
			$photosArray = '<a href="'.G5_URL.'/_map/?map_id='.$map_id.'" target="_top">@ '.$sbj.'</a><br /><i class="fa fa-camera"></i> '.$row['photo_date'];
			$uploadPhotos = '';
			if($is_member&&$w) $uploadPhotos = '<form action="./json_do.php" method="post"><input type="hidden" name="action" value="uploadPhotos"><input type="hidden" name="map_id" value="'.$map_id.'"><input type="hidden" name="mapPos" value="'.$row['map_address'].'"><input type="hidden" name="chkPhotos" class="chkPhotos"><span class="Ccrimson msgPhotos">선택한 사진이 없습니다.</span><br /><button type="submit" class="btn btn-primary btn-xs uploadPhoto"><i class="fa fa-map-marker"></i> 이 지도 위치에 사진 올리기</button>';
?>
		{
			latitude: getLat('<?php echo $row['map_address']?>'),
			longitude: getLng('<?php echo $row['map_address']?>'),
			id: '<?php echo $pId?>',
			html: {
				content: '<div class="imgMarker"><img src="<?php echo $row['thumb2']?>"><br /><strong><?php echo $row['summary']?></strong><div class="infoWindow"><?php echo $photosArray.$uploadPhotos?></div></div>',
				popup: true
			}
        },
	<?php } ?>
		],
<?php } else { ?>
		latitude: 35.72129098165948,
        longitude: 127.01851844787598,
<?php } ?>
		zoom: 14,
		maptype: 'ROADMAP',
		hideByClick: true,
		oneInfoWindow: false,
        disableDoubleClickZoom: true,
		scrollwheel: false
/*
		zoom: 14,
		maptype: 'ROADMAP',
		hideByClick: true,
		oneInfoWindow: false,
        disableDoubleClickZoom: false,
		scrollwheel: false
*/
    });
	
	$.goMap.fitBounds();

//	var w = '<?php echo $w?>';
	if(w) {
	$.goMap.createListener({type:'map'}, 'click', function(event) {
		$("#mapPos").val(event.latLng);
		var mapPosVal = $("#mapPos").val();
		$(".chkPhotos,#chkPhotos").val('');
		$("#imgArrayGeo li i.checkImg").hide();
		$(".msgPhotos").html('선택한 사진이 없습니다.');
//		var mapUrl = '<?php echo $_SERVER['REQUEST_URI']?>'; //$('iframe#ifr-geo-map').attr('src');
		var uploadPhotos = '';
		if(g5_is_member) uploadPhotos = '<form action="./json_do.php" method="post"><input type="hidden" name="action" value="uploadPhotos"><input type="hidden" name="map_id" value="'+map_id+'"><input type="hidden" name="mapPos" value="'+mapPosVal+'"><input type="hidden" name="mapUrl" value="'+pageUrl+'"><input type="hidden" name="chkPhotos" class="chkPhotos"><span class="Ccrimson msgPhotos">선택한 사진이 없습니다.</span><br /><button type="submit" class="btn btn-primary btn-xs uploadPhoto"><i class="fa fa-map-marker"></i> 이 지도 위치에 사진 올리기</button></form>';
		$.goMap.createMarker({
			latitude: getLat(mapPosVal),
			longitude: getLng(mapPosVal),
			icon: './img/icon_landMg.png',
			html: {
				content: '<div class="imgMarker ff-ng">새로 지정한 위치입니다.<div class="infoWindow">'+uploadPhotos+'</div></div>',
				popup: true
			},
			draggable: false
        });
	});
	}

	$(".checkImg").hide();
<?php if($w) { ?>
	$("#imgArrayGeo li").click(function(){
		var thisId = $(this).attr('id');
		var chkPhotosVal = $("#chkPhotos").val();
		if (eval(chkPhotosVal.indexOf(thisId+'_'))<0) {
			var newchkPhotosVal = thisId+"_"+chkPhotosVal;
			$(".chkPhotos,#chkPhotos").val(newchkPhotosVal);
			$("#imgArrayGeo li i#chk"+thisId).show();
			var chkPhotosVal = $("#chkPhotos").val();
			var cP = chkPhotosVal.split('_');
			var cPnum = cP.length - 1;
			if(cPnum>0) $(".msgPhotos").html('선택한 사진 '+cPnum+'개');
			else $(".msgPhotos").html('선택한 사진이 없습니다.');
		} else {
			var newchkPhotosVal = chkPhotosVal.replace(thisId+'_','');
			$(".chkPhotos,#chkPhotos").val(newchkPhotosVal);
			$("#imgArrayGeo li i#chk"+thisId).hide();
			var chkPhotosVal = $("#chkPhotos").val();
			var cP = chkPhotosVal.split('_');
			var cPnum = cP.length - 1;
			if(cPnum>0) $(".msgPhotos").html('선택한 사진 '+cPnum+'개');
			else $(".msgPhotos").html('선택한 사진이 없습니다.');
		}
	});
<?php } else { ?>
	$(".checkImg").show();
	$("#imgArrayGeo li").click(function(){
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
//		google.maps.event.trigger($($.goMap.mapId).data(sVal2), 'click');
	});
<?php } ?>

	$("#btn-windowGeo").click(function(){
		var schCheckArrayVal2 = $("#schCheckArray2").val();
		if(schCheckArrayVal2=='') $("#gmap-window").fadeIn('fast').text("선택한 사진그룹이 없습니다.").fadeOut(3000);
		var sVal = schCheckArrayVal2.split("_");
		var sValNum = sVal.length - 1;
		for(var i=0;i<sValNum;i++) {
			var sVal2 = sVal[i].replace(';','');
			google.maps.event.trigger($($.goMap.mapId).data(sVal2), 'click');
		}
	});
	
});
</script>

<?php
include_once('./tail.sub.php');
?>