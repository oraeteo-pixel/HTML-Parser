<style type="text/css">
#gpf_picasa{position:relative;width:95%;background-color:#fff;font-size:10pt;line-height:150%;}
#gpf_picasa .gpp_desc { padding:10px; border:1px solid #eaeaea; color:#555;}
#gpf_picasa a.gpp_link { color:#0066ff; font-weight:bold;}
#gpf_picasa .gpp_btn { background-color:#888;color:#fff;padding:5px 10px;border:0; }
#gpf_picasa #gpp_attached{margin-top:10px;padding:5px;border:2px solid #e0e0e0;overflow:auto;}
#gpf_picasa .gpp_imgs_row { width:98%; float:left; padding:0}
#gpf_picasa #gpp_menu { position:absolute; right:10px; margin-top:-35px; padding-right:10px;}
#gpf_picasa .gpp_txt { width:90%;height:20px;line-height:20px; border:0;border-bottom:1px solid #eaeaea }
#gpf_picasa .gpp_img { padding:2px; border:1px solid #ccc; }
#gpf_picasa .gpp_imgs_row table td { padding:5px; }
</style>

<link rel="stylesheet" href="<?php echo $plugin_url?>/uploadify/uploadify.css" type="text/css">
<script type="text/javascript" src="<?php echo $plugin_url?>/uploadify/jquery.uploadify-3.1.min.js"></script>

<div id="gpf_picasa">

	<div class="gpp_body">

		<div id="upload_form">
    <div id="html_upload" style="display:none">
        <iframe src="<?php echo $plugin_url; ?>/tpl/write.form.iframe.php?bo_table=<?php echo $bo_table; ?>&wr_id=<?php echo $wr_id; ?>" frameborder="0" scrolling="no" width="100%" height="100px"></iframe>
      </div>
      <input type="file" name="picture_uploadify" id="picture_uploadify"/>
		</div>

        <div id="gpp_opts">
          <input type="checkbox" class="chkbox" id="wr_no_view" name="wr_no_view" value="1" <?php if($wr_no_view) { echo 'checked'; }?>/> 
          <label for="wr_no_view">내용보기에서 이미지 출력하지 않음</label>
        </div>

		<div id="gpp_attached">
			<h2>첨부 이미지</h2>
			<div id="gpp_imgs">
				<? for($i=0, $to=count($photo_list); $i<$to; $i++) { $img = $photo_list[$i]; ?>
				<div id="gpp_img_row_<?=$img['id']?>" data-id="<?=$img['id']?>" class="gpp_imgs_row">

					<table cellspacing="0" cellpadding="0" border="0" width="100%">
					<colgroup><col width="80px"/><col/><col width="120px"/></colgroup>
					<tr>
						<td style="height:50px">
							<a href="<?=$img['imgurl']?>" target="_blank"><img src="<?=$img['thumb1']?>" class="gpp_img"/></a>
						</td>
						<td>
							<input type="text" id="gpp_summary_<?=$img['id']?>" class="gpp_txt" value="<?=htmlspecialchars($img['summary'])?>"/>
						</td>
						<td align="center">
							<img src="<?php echo $plugin_url; ?>/imgs/loading.gif" style="display:none;" id="gpp_loading_<?=$img['id']?>"/>
							<span>
                                <a href="javascript:gpp.show_code(<?=$img['id']?>);">코드</a> | 
                                <a href="javascript:gpp.update_summary(<?=$img['id']?>);">변경</a> | 
                                <a href="javascript:gpp.delete_photo(<?=$img['id']?>);">삭제</a>
							</span>
						</td>
					</tr>
					</table>
				</div>
				<? } ?>
			<? if(empty($photo_list)) { echo '<span class="gpp_noimage">첨부된 이미지가 없습니다.</span>'; } ?>
			</div>
		</div>

  </div>

</div> <!--// gpf_picasa -->

<script type="text/javascript">
var gpp = {};
gpp.imgs = $('#gpp_imgs');
gpp.show_ing = function(img_id) {
	$('#gpp_loading_'+img_id).show().next().hide();
};
gpp.hide_ing = function(img_id) {
	$('#gpp_loading_'+img_id).hide().next().show();
}
gpp.delete_photo = function(img_id) {
	if(!confirm('삭제하시겠습니까?')) return;
	gpp.show_ing(img_id);
  $.ajax({
    url : '<?php echo GP_URL; ?>/do.php',
    data : { id : 'picasa', act : 'picasa_do', md : 'delete_image', bo_table : '<?php echo $bo_table; ?>', wr_id : '<?php echo $wr_id; ?>', img_id :  img_id },
    type : 'post',
    dataType : 'json',
    success : function(json) {
      if(json.code == 1) {
        $('#gpp_img_row_'+json.img_id).remove();
		    if($('.gpp_imgs_row').length == 0) gpp.imgs.html('<span class="gpp_noimage">첨부된 이미지가 없습니다.</span>');
      } else alert(json.msg);
    },
    error : function(xhr, txt, error) {
      alert(txt + ' : ' + error);
    },
    complete : function(xhr, txt) {
		  gpp.hide_ing(img_id);
    }
  });
};
gpp.show_code = function(img_id) {
  var img_size = prompt('이미지 크기를 입력하세요.\n - S : 작은크기\n - M : 중간크기 \n - L : 큰크기 \n - O : 원본', 'M');
  prompt('이미지 삽입코드 (복사해서 본문에 추가하세요)', '{{PICASA:'+img_id+':'+img_size+'}}');
};
gpp.update_summary = function(img_id) {
	gpp.show_ing(img_id);
	if(img_id == null || img_id == 'undefined') alert('잘못된 이미지 아이디 : ' + img_id);
  $.ajax({
    url : '<?php echo GP_URL; ?>/do.php',
    data : { id : 'picasa', act : 'picasa_do', md : 'update_summary', bo_table : '<?php echo $bo_table; ?>', wr_id : '<?php echo $wr_id; ?>', img_id : img_id, summary : $('#gpp_summary_'+img_id).val() },
    type : 'post',
    dataType : 'json',
    success : function(json) {
      if(json.code != 1) alert(json.msg);
    },
    error : function(xhr, txt, error) {
      alert(txt + ' : ' + error);
    },
    complete : function(xhr, txt) {
		  gpp.hide_ing(img_id);
    }
  });
}
gpp.add_image = function(id, img_url, thumb_url, summary) {
  $('.gpp_noimage').remove();
  gpp.imgs.prepend([
				'<div id="gpp_img_row_'+id+'" data-id="'+id+'" class="gpp_imgs_row">',
					'<table cellspacing="0" cellpadding="0" border="0" width="100%">', 
					'<colgroup><col width="80px"/><col/><col width="80px"/></colgroup>', 
					'<tr>', 
						'<td style="height:50px">', 
							'<a href="'+img_url+'" target="_blank"><img src="'+thumb_url+'" class="gpp_img"/></a>', 
						'</td>', 
						'<td>', 
						'	<input type="text" id="gpp_summary_'+id+'" class="gpp_txt" value="'+summary+'"/>', 
						'</td>', 
						'<td align="center">', 
						'	<img src="<?php echo $plugin_url; ?>/imgs/loading.gif" style="display:none;" id="gpp_loading_'+id+'"/>', 
						'	<span>', 
                '		<a href="javascript:gpp.update_summary('+id+');">변경</a> | <a href="javascript:gpp.delete_photo('+id+');">삭제</a> ', 
						'	</span>', 
					'	</td>', 
				'	</tr>', 
				'	</table>', 
				'</div>'
        ].join(''));
};
gpp.single_upload_done = function(json) {
  if(json.code != '1') {
    alert(json.msg);
  } else {
    gpp.add_image(json.img_id, json.photo.img_url, json.photo.thumbnails[0].url, json.summary);
  }
};
$(function() {
	$('#picture_uploadify').uploadify({
		'buttonText' : '사진파일들을 선택해주세요. 클릭!',
    'fileTypeDesc' : '이미지 파일',
    'fileTypeExts' : '*.gif; *.jpg; *.jpeg; *.png',
    'width' : 220,
    'height' : 22,
		'swf'      : '<?php echo $plugin_url;?>/uploadify/uploadify.swf',
		'uploader' : '<?php echo GP_URL; ?>/do.php',
    'formData' : { 'id' : 'picasa', 'act' : 'picasa_do', 'md' : 'upload_ajax', 'bo_table' : '<?=$bo_table?>', 'wr_id' : '<?=$wr_id?>', 'mb_id' : '<?php echo $member['mb_id'];?>' },
		'onUploadSuccess' : function(file, data, response) {
			var json = $.parseJSON(data);
			if(json.code != '1') {
				alert(json.msg);
      } else {
        gpp.add_image(json.img_id, json.photo.imgurl, json.photo.thumbnails[0].url, json.summary);
      }
		},
		'onQueueComplete' : function(queueData) {
		},
		'onFallback' : function() {
      $("#html_upload").show();
			$("form[name=upfrm]").show();
			$("#picture_uploadify").hide();
			$("#gpp_single_desc").show();
			$("#gpp_multi_desc").hide();
		}
	});
});
</script>
