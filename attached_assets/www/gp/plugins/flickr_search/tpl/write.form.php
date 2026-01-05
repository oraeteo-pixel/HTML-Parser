<?
if (!defined("_GNUBOARD_")) exit; // 개별 페이지 접근 불가 
?>
<section id="fkr">
  <label class="sound_only" for="fkr_sort">이미지 검색 정렬 방법</label>
  <select name="fkr_sort" id="fkr_sort">
    <option value="interestingness-desc">인기순(ㅎ->ㄱ)</option>
    <option value="interestingness-asc">인기순(ㄱ->ㅎ)</option>
    <option value="date-posted-desc">포스팅시간(ㅎ->ㄱ)</option>
    <option value="date-posted-asc">포스팅시간(ㄱ->ㅎ)</option>
    <option value="date-taken-desc">촬영시간(ㅎ->ㄱ)</option>
    <option value="date-taken-asc">촬영시간(ㄱ->ㅎ)</option>
    <option value="relevance">관련성</option>
  </select>
  <label class="sound_only" for="fkr_stx">이미지 검색어</label>
  <input type="text" name="fkr_stx" id="fkr_stx" size="20" /> 
  <input type="button" id="fkr_btn" name="fkr_btn" value="검색" class="sl_btn"/>
  <img src="<?php echo $plugin_url;?>/imgs/loading.gif" class="fkr_loading_img"/>
  <div id="fkr_img_url_info"></div>
  <input type="hidden" name="fkr_img_url" id="fkr_img_url" value="<?php echo htmlspecialchars($fkr['img_url']); ?>"/>
  <input type="hidden" name="fkr_img_source" id="fkr_img_source" value="<?php echo htmlspecialchars($fkr['img_source']); ?>"/>
  <input type="hidden" name="fkr_img_title" id="fkr_img_title" value="<?php echo htmlspecialchars($fkr['img_title']); ?>"/>
  <input type="hidden" name="fkr_width" id="fkr_width" value="<?php echo htmlspecialchars($fkr['width']); ?>"/>
  <input type="hidden" name="fkr_height" id="fkr_height" value="<?php echo htmlspecialchars($fkr['height']); ?>"/>
  <input type="hidden" name="fkr_owner_name" id="fkr_owner_name" value="<?php echo htmlspecialchars($fkr['owner_name']); ?>"/>
  <input type="hidden" name="fkr_owner_url" id="fkr_owner_url" value="<?php echo htmlspecialchars($fkr['owner_url']); ?>"/>
  <input type="hidden" name="fkr_license" id="fkr_license" value="<?php echo htmlspecialchars($fkr['license']); ?>"/>
  <div class="fkr_search_bar">
    <div class="fkr_search_bar_left">
      <span class="fkr_page_info"></span> 
    </div>
    <div class="fkr_search_bar_right">
      <a href="javascript:fkr.search_prev();" class="sl_btn fkr_prev_btn">이전</a>
      <a href="javascript:fkr.search_next();" class="sl_btn fkr_next_btn">다음</a>
    </div>
  </div>
  <div id="fkr_results"></div>
  <div class="fkr_search_bar">
    <div class="fkr_search_bar_left">
      <span class="fkr_page_info"></span> 
    </div>
    <div class="fkr_search_bar_right">
      <a href="javascript:fkr.search_prev();" class="sl_btn fkr_prev_btn">이전</a>
      <a href="javascript:fkr.search_next();" class="sl_btn fkr_next_btn">다음</a>
    </div>
  </div>
</section>

<script type="text/javascript">
var fkr = {} 
fkr.purl = '<?php echo $plugin_url; ?>';
fkr.page = 1;
fkr.thumb_idx = 2;
fkr.img_url = $('#fkr_img_url_info');
fkr._img_url= $('#fkr_img_url');
fkr._img_source= $('#fkr_img_source');
fkr._img_title= $('#fkr_img_title');
fkr._width= $('#fkr_width');
fkr._height= $('#fkr_height');
fkr._owner_url= $('#fkr_owner_url');
fkr._owner_name= $('#fkr_owner_name');
fkr._license= $('#fkr_license');
fkr.sort= $('#fkr_sort');
fkr.stx = $('#fkr_stx');
fkr.btn = $('#fkr_btn');
fkr.btn_prev = $('.fkr_prev_btn');
fkr.btn_next= $('.fkr_next_btn');
fkr.results = $('#fkr_results');
fkr.loading_img= $('.fkr_loading_img');
fkr.page_info = $('.fkr_page_info');
fkr.searching = false;
fkr.prev_stx= '';
fkr.prev_sort= '';
fkr.list_cache = [];
fkr.item_cache = [];
fkr.reset_image = function() {
  fkr._img_url.val('');
  fkr._img_source.val('');
  fkr._img_title.val('');
  fkr._width.val('');
  fkr._height.val('');
  fkr._owner_name.val('');
  fkr._owner_url.val('');
  fkr._license.val('');
  fkr.img_url.html('').hide();
};
fkr.set_image = function(id, pix) {
  var p = fkr.item_cache[id];
  fkr._img_source.val(p['url_'+pix]);
  fkr._img_url.val('http://www.flickr.com/photos/'+p.owner+'/'+id+'/sizes/');
  fkr._img_title.val(p.title);
  fkr._width.val(p['width_'+pix]);
  fkr._height.val(p['height_'+pix]);
  fkr._owner_name.val(p.ownername);
  fkr._owner_url.val('http://www.flickr.com/people/'+p.owner);
  fkr._license.val(p.license);
  fkr.img_url.html('<div class="fkr_res_label">선택이미지<a href="javascript:fkr.reset_image();">결과지우기</a></div><a href="'+fkr._img_url.val()+'" target="_blank">' + fkr._img_source.val()+'</a>').show();
  alert('이미지가 선택되었습니다.');
};
fkr.print_result = function(photo) {
  var img_src = photo.url_t;
  var img_size = [];
  var cc_by = '<img src="'+fkr.purl+'/imgs/cc_by.gif" border="0" align="absmiddle"/>';
  var cc_nc = '<img src="'+fkr.purl+'/imgs/cc_nc.gif" border="0" align="absmiddle"/>';
  var cc_nd = '<img src="'+fkr.purl+'/imgs/cc_nd.gif" border="0" align="absmiddle"/>';
  var cc_sa = '<img src="'+fkr.purl+'/imgs/cc_sa.gif" border="0" align="absmiddle"/>';
  var img_license = { '0' : '', '1' : cc_by+cc_nc+cc_sa, '2' : cc_by+cc_nc, '3' : cc_by+cc_nc+cc_nd, '4' : cc_by, '5' : cc_by+cc_sa, '6' : cc_by+cc_nd }; 
  var curl = 'http://creativecommons.org/licenses/';
  var license_tag= { '0' : '', '1' : 'by-nc-sa', '2' : 'by-nc', '3' : 'by-nc-nd', '4' : 'by', '5' : 'by-sa', '6' : 'by-nd' };

  fkr.item_cache[photo.id] = photo;
  $.each([ 't', 's', 'q', 'm', 'n', 'z', 'l', 'o' ], function(key, value) {
    if(photo['width_'+value]) img_size.push('<a href="javascript:fkr.set_image(\''+photo.id+'\', \''+value+'\');">'+photo['width_'+value]+'x'+photo['height_'+value]+'</a>');
  });
  img_sizes = img_size.join(', ');
    
  if(photo.license > 0) license = '<span class="fkr_photo_license">사용권 : <a href="'+curl+license_tag[photo.license]+'/2.0/deed.ko" target="_blank"><span class="fkr_cc_img">' + img_license[photo.license]+'</span></a></span>';
  else license = '';
  fkr.results.append([
    '<div class="fkr_row">',
    ' <div class="fkr_img"><a href="http://www.flickr.com/photos/'+photo.owner+'/'+photo.id+'/sizes/" target="_blank"><img src="'+photo.url_t+'"/></a></div>',
    ' <div class="fkr_row_content" style="position:absolute;top:0;left:'+(parseInt(photo.width_t)+15)+'px">',
    license,
    '   <br/><span class="fkr_owner">작가 : <a href="http://www.flickr.com/people/'+photo.owner+'" target="_blank">'+photo.ownername+'</a></span>',
    '   <br/><span class="fkr_title">제목 : <a href="http://www.flickr.com/photos/'+photo.owner+'/'+photo.id+'/sizes/" target="_blank">'+photo.title+'</a></span>',
    '   <div class="fkr_sizes"><span class="fkr_size_label">크기선택 : </span>'+img_sizes+'</div>',
    ' </div>',
    '</div>'
    ].join(''));
};
fkr.ajax_error = function(jqXHR, textStatus, errorThrown) {
  alert(errorThrown);
};
fkr.render = function(json) {
  if(json.code == -1) { alert(json.msg); return; }
  fkr.list_cache[fkr.page] = json;
  fkr.results.html('').show();
  fkr.btn_prev.hide();
  fkr.btn_next.hide();
  if(json.info.page > 1) fkr.btn_prev.show();
  if(json.info.page < json.info.pages) fkr.btn_next.show();
  delete fkr.item_cache;
  fkr.page_info.html(json.info.page + '/' + json.info.pages + 'page ');
  fkr.item_cache = [];
  $.each(json.list, function(key, photo) {
    fkr.print_result(photo);
  });
};
fkr.search = function() {
  if(fkr.searching) { alert('검색중입니다'); return; }
  var stx = fkr.stx.val();
  var sort = fkr.sort.val();
  if(fkr.prev_stx != stx || fkr.prev_sort != sort) { 
    delete fkr.list_cache; 
    fkr.list_cache = []; 
    fkr.prev_stx = stx; 
    fkr.prev_sort = sort; 
    fkr.page = 1;
  }
  if(fkr.list_cache[fkr.page]) { fkr.render(fkr.list_cache[fkr.page]); return; }
  fkr.searching = true;
  fkr.loading_img.show();
  $.ajax({
    url: '<?php echo GP_URL;?>/do.php?scope=<?php echo $scope;?>&bo_table=<?php echo $bo_table; ?>&wr_id=<?php echo $wr_id; ?>&id=<?php echo $plugin_id; ?>&act=flickr_search&stx='+stx+'&page='+fkr.page+'&sort='+sort,
    type : 'post',
    dataType : 'json',
    error : fkr.ajax_error,
    success : fkr.render,
    complete : function() { fkr.searching = false; fkr.loading_img.hide(); }
  });
};
fkr.btn.click(fkr.search);
fkr.stx.keypress(function(evt) {
  var keycode = (evt.keyCode ? evt.keyCode : evt.which);
  if(keycode == '13'){
    evt.preventDefault();
    fkr.search();
  }
});
fkr.search_prev = function() { if(fkr.searching) return; fkr.page--; fkr.search(); }
fkr.search_next = function() { if(fkr.searching) return; fkr.page++; fkr.search(); }
$(document).ready(function() {
  if(fkr._img_source.val() != '')
  {
    fkr.img_url.html('<div class="fkr_res_label">선택이미지<a href="javascript:fkr.reset_image();">결과지우기</a></div><a href="'+fkr._img_url.val()+'" target="_blank">' + fkr._img_source.val()+'</a>').show();
  }
});
</script>


