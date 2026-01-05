// ZIWOO WYSIWYG
// Licence : GPL (http://www.gnu.org/licenses/licenses.html#GPL)
// Update & Download  : http://www.ziwoo.net/zb/view.php?boardid=zb_ziwoo_javascript&uid=120
// This page was last modified on 2011.12.14 (Since 2006.09.23)

if(window.addEventListener) window.addEventListener("load", loadWysiwyg, false);
else if(window.attachEvent) window.attachEvent("onload", loadWysiwyg);

function loadWysiwyg(){
	var n = 0;
	ziwooWysiwyg = new Array();
	var textareaObj = document.getElementsByTagName('textarea');
	for (var i=0;i<textareaObj.length;i++){
		if(textareaObj[i].getAttribute("title")=="editor"){			
			textareaObj[i].title = "";
			ziwooWysiwyg[n] = new zwig(textareaObj[i], n);
			ziwooWysiwyg[n].createElm();
			n++;
		}
	}
}

var zwig = function(txObj, n){
	var txNum = 0;
	var txArray = document.getElementsByName(txObj.name);
	for (var i=0;i<txArray.length;i++){
		if(txArray[i]==txObj){
			txNum = i;
			break;
		}
	}
	var txName = txObj.name;
	var edName = "iframe"+txName+txNum;
	var edObj, edWin, edDoc, txObj;

	var MSIE = 0;
	if(navigator.appName == "Microsoft Internet Explorer") MSIE = 1;
	var layers = new Array();
	layers[0] = "fontfaceLayer";
	layers[1] = "fontsizeLayer";
	layers[2] = "fgLayer";
	layers[3] = "bgLayer";
	layers[4] = "linkLayer";
	layers[5] = "tableInsertLayer";
	var bookmarkSelection = null;

	this.createElm = function(){		
		edObj = document.createElement("iframe");
		edObj.setAttribute("id",edName);
		edObj.setAttribute("scrolling","yes");
		edObj.setAttribute("frameBorder","no");
		edObj.setAttribute("wrap","virtual");
		edObj.style.width = txObj.style.width.replace("px","")-2+"px";
		edObj.style.height = txObj.style.height.replace("px","")+"px";
		edObj.style.backgroundColor = "#FFFFFF";
		edObj.style.border = "1px solid #D0D0D0";
		edObj.style.marginTop = "2px";

		txObj.parentNode.insertBefore(edObj,txObj);

		edWin = edObj.contentWindow;
		edDoc = edWin.document;
		edDoc.open(); 
		edDoc.write("<html><head><style>");	 
		if(MSIE){			
			for(var s=0; s<document.styleSheets.length; s++){
				edDoc.write(document.styleSheets[s].cssText);
			}
		}else{
			for(var s=0; s<document.styleSheets.length; s++){
				for(var t=0; t<document.styleSheets.item(s).cssRules.length; t++){
					edDoc.write(document.styleSheets.item(s).cssRules.item(t).cssText);
				}
			}
		}
		edDoc.write("</style></head><body bgcolor=white>");
		edDoc.write(txObj.value);
		edDoc.write("</body></html>");
		edDoc.close();
		edDoc.designMode = "on";

		txObj.style.backgroundColor = "#F8F8F8";
		txObj.style.color = "#336699";
		txObj.style.fontSize = "9pt";
		txObj.style.fontFamily = "Arial";
		txObj.style.display = "none";
		txObj.style.border = "1px solid #336699";

		if(document.addEventListener){			
			edDoc.addEventListener("keydown", ziwooWysiwyg[n].p2br, false);
			edDoc.body.addEventListener("blur", ziwooWysiwyg[n].editor2source, false);
			edDoc.addEventListener("blur", ziwooWysiwyg[n].editor2source, false);	
			edDoc.addEventListener("mousedown", ziwooWysiwyg[n].hideLayer, false);	
			txObj.addEventListener("blur", ziwooWysiwyg[n].source2editor, false);
		}else if(document.attachEvent){
			edDoc.attachEvent("onkeydown", ziwooWysiwyg[n].p2br);
			edDoc.attachEvent("onmousedown", ziwooWysiwyg[n].hideLayer);	
			document.getElementById(edName).attachEvent("onblur", ziwooWysiwyg[n].editor2source);
			txObj.attachEvent("onblur", ziwooWysiwyg[n].source2editor);
		}

		var ctrlObj  = " <table width=\""+txObj.style.width+"\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\"> ";
		ctrlObj += " <td style=\"font-size:5px; padding-left:1px;\"> ";
		
		ctrlObj += " 	<img src=\"./editor_images/ed_fontface.gif\" onClick=\"ziwooWysiwyg["+n+"].viewLayer(event, 'fontfaceLayer');\"> ";
		ctrlObj += " 	<img src=\"./editor_images/ed_fontsize.gif\" onClick=\"ziwooWysiwyg["+n+"].viewLayer(event, 'fontsizeLayer');\"> ";
		
		ctrlObj += " 	<img src=\"./editor_images/ed_virtical.gif\"> ";

		ctrlObj += " 	<img src=\"./editor_images/ed_format_bold.gif\" onClick=\"ziwooWysiwyg["+n+"].execCmd('bold', null)\"> ";
		ctrlObj += " 	<img src=\"./editor_images/ed_format_italic.gif\" onClick=\"ziwooWysiwyg["+n+"].execCmd('italic', null)\"> ";
		ctrlObj += " 	<img src=\"./editor_images/ed_format_underline.gif\" onClick=\"ziwooWysiwyg["+n+"].execCmd('underline', null)\"> ";
		ctrlObj += " 	<img src=\"./editor_images/ed_format_strike.gif\" onClick=\"ziwooWysiwyg["+n+"].execCmd('StrikeThrough', null)\"> ";

		ctrlObj += " 	<img src=\"./editor_images/ed_virtical.gif\"> ";

		ctrlObj += " 	<img src=\"./editor_images/ed_color_fg.gif\" onClick=\"ziwooWysiwyg["+n+"].viewLayer(event, 'fgLayer');\"> ";
		ctrlObj += " 	<img src=\"./editor_images/ed_color_bg.gif\" onClick=\"ziwooWysiwyg["+n+"].viewLayer(event, 'bgLayer');\"> ";

		ctrlObj += " 	<img src=\"./editor_images/ed_virtical.gif\"> ";
		
		ctrlObj += " 	<img src=\"./editor_images/ed_align_left.gif\" onClick=\"ziwooWysiwyg["+n+"].execCmd('justifyleft', null)\"> ";
		ctrlObj += " 	<img src=\"./editor_images/ed_align_center.gif\" onClick=\"ziwooWysiwyg["+n+"].execCmd('justifycenter', null)\"> ";
		ctrlObj += " 	<img src=\"./editor_images/ed_align_right.gif\" onClick=\"ziwooWysiwyg["+n+"].execCmd('justifyright', null)\"> ";

		ctrlObj += " 	<img src=\"./editor_images/ed_virtical.gif\"> ";

		ctrlObj += " 	<img src=\"./editor_images/ed_list_number.gif\" onClick=\"ziwooWysiwyg["+n+"].execCmd('insertorderedlist', null)\"> ";
		ctrlObj += " 	<img src=\"./editor_images/ed_list_dot.gif\" onClick=\"ziwooWysiwyg["+n+"].execCmd('insertunorderedlist', null)\"> ";
		ctrlObj += " 	<img src=\"./editor_images/ed_format_outdent.gif\" onClick=\"ziwooWysiwyg["+n+"].execCmd('outdent', null)\"> ";
		ctrlObj += " 	<img src=\"./editor_images/ed_format_indent.gif\" onClick=\"ziwooWysiwyg["+n+"].execCmd('indent', null)\"> ";

		ctrlObj += " 	<img src=\"./editor_images/ed_virtical.gif\"> ";

		ctrlObj += " 	<img src=\"./editor_images/ed_hr.gif\" onClick=\"ziwooWysiwyg["+n+"].execCmd('InsertHorizontalRule', null)\"> ";
		ctrlObj += " 	<img src=\"./editor_images/ed_link.gif\" onClick=\"ziwooWysiwyg["+n+"].viewLayer(event, 'linkLayer');\"> ";
		ctrlObj += " 	<img src=\"./editor_images/ed_table_insert.gif\" onClick=\"ziwooWysiwyg["+n+"].viewLayer(event, 'tableInsertLayer');\"> ";

		ctrlObj += " 	<img src=\"./editor_images/ed_virtical.gif\"> ";
		
		ctrlObj += " 	<img src=\"./editor_images/ed_reset.gif\" onClick=\"ziwooWysiwyg["+n+"].execCmd('removeformat', null)\"> ";

		ctrlObj += " 	<img src=\"./editor_images/ed_virtical.gif\"> ";

		ctrlObj += " 	<img id=\"viewEdirorBtn"+n+"\" src=\"./editor_images/ed_editor.gif\" style=\"display:none\" onClick=\"ziwooWysiwyg["+n+"].viewEdiror();\"> ";
		ctrlObj += " 	<img id=\"viewSourceBtn"+n+"\" src=\"./editor_images/ed_html.gif\" style=\"display:inline\" onmouseUp=\"ziwooWysiwyg["+n+"].viewSource();\"> ";		
		
		ctrlObj += " 	<br> ";

		ctrlObj += " 	<div id=\"fontfaceLayer"+n+"\" style=\"position:absolute; width:70px; border:1px solid #999999; display:none;\"> ";
		ctrlObj += " 		<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" bgcolor=\"#ffffff\"> ";
		ctrlObj += " 		<tr onmouseover=\"this.style.backgroundColor='#E0E0E0'\" onmouseout=\"this.style.backgroundColor=''\"><td style=\"padding-left:3px;\" onClick=\"ziwooWysiwyg["+n+"].execCmd('fontname', '돋움');\">돋움</td></tr> ";
		ctrlObj += " 		<tr onmouseover=\"this.style.backgroundColor='#E0E0E0'\" onmouseout=\"this.style.backgroundColor=''\"><td style=\"padding-left:3px;\" onClick=\"ziwooWysiwyg["+n+"].execCmd('fontname', '굴림');\">굴림</td></tr> ";
		ctrlObj += " 		<tr onmouseover=\"this.style.backgroundColor='#E0E0E0'\" onmouseout=\"this.style.backgroundColor=''\"><td style=\"padding-left:3px;\" onClick=\"ziwooWysiwyg["+n+"].execCmd('fontname', '바탕');\">바탕</td></tr> ";
		ctrlObj += " 		<tr onmouseover=\"this.style.backgroundColor='#E0E0E0'\" onmouseout=\"this.style.backgroundColor=''\"><td style=\"padding-left:3px;\" onClick=\"ziwooWysiwyg["+n+"].execCmd('fontname', 'Arial');\">Arial</td></tr> ";
		ctrlObj += " 		<tr onmouseover=\"this.style.backgroundColor='#E0E0E0'\" onmouseout=\"this.style.backgroundColor=''\"><td style=\"padding-left:3px;\" onClick=\"ziwooWysiwyg["+n+"].execCmd('fontname', 'Tahoma');\">Tahoma</td></tr> ";
		ctrlObj += " 		<tr onmouseover=\"this.style.backgroundColor='#E0E0E0'\" onmouseout=\"this.style.backgroundColor=''\"><td style=\"padding-left:3px;\" onClick=\"ziwooWysiwyg["+n+"].execCmd('fontname', 'Verdana');\">Verdana</td></tr> ";
		ctrlObj += " 		<tr onmouseover=\"this.style.backgroundColor='#E0E0E0'\" onmouseout=\"this.style.backgroundColor=''\"><td style=\"padding-left:3px;\" onClick=\"ziwooWysiwyg["+n+"].execCmd('fontname', 'Time');\">Time</td></tr> ";
		ctrlObj += " 		</table> ";
		ctrlObj += " 	</div> ";

		ctrlObj += " 	<div id=\"fontsizeLayer"+n+"\" style=\"position:absolute; width:38px; border:1px solid #999999; display:none;\"> ";
		ctrlObj += " 		<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" bgcolor=\"#ffffff\"> ";
		ctrlObj += " 		<tr onmouseover=\"this.style.backgroundColor='#E0E0E0'\" onmouseout=\"this.style.backgroundColor=''\"><td style=\"padding-left:3px;\" onClick=\"ziwooWysiwyg["+n+"].execCmd('fontsize', 1);\">1</td></tr> ";
		ctrlObj += " 		<tr onmouseover=\"this.style.backgroundColor='#E0E0E0'\" onmouseout=\"this.style.backgroundColor=''\"><td style=\"padding-left:3px;\" onClick=\"ziwooWysiwyg["+n+"].execCmd('fontsize', 2);\">2</td></tr> ";
		ctrlObj += " 		<tr onmouseover=\"this.style.backgroundColor='#E0E0E0'\" onmouseout=\"this.style.backgroundColor=''\"><td style=\"padding-left:3px;\" onClick=\"ziwooWysiwyg["+n+"].execCmd('fontsize', 3);\">3</td></tr> ";
		ctrlObj += " 		<tr onmouseover=\"this.style.backgroundColor='#E0E0E0'\" onmouseout=\"this.style.backgroundColor=''\"><td style=\"padding-left:3px;\" onClick=\"ziwooWysiwyg["+n+"].execCmd('fontsize', 4);\">4</td></tr> ";
		ctrlObj += " 		<tr onmouseover=\"this.style.backgroundColor='#E0E0E0'\" onmouseout=\"this.style.backgroundColor=''\"><td style=\"padding-left:3px;\" onClick=\"ziwooWysiwyg["+n+"].execCmd('fontsize', 5);\">5</td></tr> ";
		ctrlObj += " 		<tr onmouseover=\"this.style.backgroundColor='#E0E0E0'\" onmouseout=\"this.style.backgroundColor=''\"><td style=\"padding-left:3px;\" onClick=\"ziwooWysiwyg["+n+"].execCmd('fontsize', 6);\">6</td></tr> ";
		ctrlObj += " 		</table> ";
		ctrlObj += " 	</div> ";

		ctrlObj += " 	<div id=\"fgLayer"+n+"\" style=\"position:absolute; width:160px; height:75px; border:1px solid #999999; display:none;\"> ";
		ctrlObj += " 		<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" bgcolor=\"#ffffff\"> ";
		ctrlObj += " 		<td> ";
		ctrlObj += " 			<table cellspacing=\"0\" cellpadding=\"0\" border=\"1\" bordercolor=\"#000000\" style=\"border-collapse:collapse; margin:7px;\"> ";
		ctrlObj += " 			<tr height=\"11\"> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FE1100\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#FE1100');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FE4C24\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#FE4C24');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FE875A\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#FE875A');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FECDA7\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#FECDA7');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#040967\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#040967');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#2D328D\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#2D328D');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#44499A\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#44499A');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#686EB8\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#686EB8');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#669900\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#669900');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#66CC00\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#66CC00');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#99FF00\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#99FF00');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FF99FF\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#FF99FF');\"></td> ";
		ctrlObj += " 			</tr> ";
		ctrlObj += " 			<tr height=\"11\"> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#6E0017\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#6E0017');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#7B243D\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#7B243D');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#834C6B\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#834C6B');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#66FFFF\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#66FFFF');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#006BD4\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#006BD4');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#0087E1\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#0087E1');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#37B7FE\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#37B7FE');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#A7DEFE\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#A7DEFE');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FFCC00\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#FFCC00');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FFFF00\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#FFFF00');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FEFE9F\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#FEFE9F');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FEFED0\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#FEFED0');\"></td> ";
		ctrlObj += " 			</tr> ";
		ctrlObj += " 			<tr height=\"11\"> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#4E003D\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#4E003D');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#6D2262\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#6D2262');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#926594\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#926594');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#C2A9C5\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#C2A9C5');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#005557\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#005557');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#03747B\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#03747B');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#579D9F\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#579D9F');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#A2C6CC\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#A2C6CC');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FF6600\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#FF6600');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FF9933\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#FF9933');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FECD8A\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#FECD8A');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FEE2B0\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#FEE2B0');\"></td> ";
		ctrlObj += " 			</tr> ";
		ctrlObj += " 			<tr height=\"11\"> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#1B0B73\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#1B0B73');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#4C379D\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#4C379D');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#876EBA\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#876EBA');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#BBBAEF\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#BBBAEF');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#008E37\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#008E37');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#26B168\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#26B168');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#47BE80\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#47BE80');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#76D3A2\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#76D3A2');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#B31C00\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#B31C00');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#B03F21\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#B03F21');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#AE623A\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#AE623A');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#AC6E54\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#AC6E54');\"></td> ";
		ctrlObj += " 			</tr> ";
		ctrlObj += " 			<tr height=\"11\"> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FEFEFE\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#FEFEFE');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#E6E6E6\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#E6E6E6');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#CDCDCD\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#CDCDCD');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#B4B4B4\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#B4B4B4');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#A8A8A8\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#A8A8A8');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#8D8D8D\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#8D8D8D');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#747474\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#747474');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#595959\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#595959');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#4B4B4B\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#4B4B4B');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#303030\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#303030');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#0A0A0A\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#0A0A0A');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#000000\" onClick=\"ziwooWysiwyg["+n+"].execCmd('forecolor', '#000000');\"></td> ";
		ctrlObj += " 			</tr> ";
		ctrlObj += " 			</table> ";
		ctrlObj += " 			</td> ";
		ctrlObj += " 		</table> ";
		ctrlObj += " 	</div> ";

		ctrlObj += " 	<div id=\"bgLayer"+n+"\" style=\"position:absolute; width:160px; height:75px; border:1px solid #999999; display:none;\"> ";
		ctrlObj += " 		<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" bgcolor=\"#ffffff\"> ";
		ctrlObj += " 		<td> ";
		ctrlObj += " 			<table cellspacing=\"0\" cellpadding=\"0\" border=\"1\" bordercolor=\"#000000\" style=\"border-collapse:collapse; margin:7px;\"> ";
		ctrlObj += " 			<tr height=\"11\"> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FE1100\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#FE1100');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FE4C24\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#FE4C24');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FE875A\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#FE875A');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FECDA7\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#FECDA7');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#040967\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#040967');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#2D328D\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#2D328D');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#44499A\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#44499A');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#686EB8\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#686EB8');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#669900\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#669900');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#66CC00\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#66CC00');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#99FF00\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#99FF00');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FF99FF\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#FF99FF');\"></td> ";
		ctrlObj += " 			</tr> ";
		ctrlObj += " 			<tr height=\"11\"> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#6E0017\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#6E0017');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#7B243D\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#7B243D');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#834C6B\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#834C6B');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#66FFFF\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#66FFFF');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#006BD4\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#006BD4');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#0087E1\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#0087E1');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#37B7FE\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#37B7FE');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#A7DEFE\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#A7DEFE');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FFCC00\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#FFCC00');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FFFF00\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#FFFF00');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FEFE9F\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#FEFE9F');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FEFED0\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#FEFED0');\"></td> ";
		ctrlObj += " 			</tr> ";
		ctrlObj += " 			<tr height=\"11\"> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#4E003D\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#4E003D');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#6D2262\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#6D2262');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#926594\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#926594');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#C2A9C5\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#C2A9C5');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#005557\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#005557');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#03747B\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#03747B');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#579D9F\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#579D9F');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#A2C6CC\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#A2C6CC');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FF6600\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#FF6600');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FF9933\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#FF9933');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FECD8A\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#FECD8A');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FEE2B0\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#FEE2B0');\"></td> ";
		ctrlObj += " 			</tr> ";
		ctrlObj += " 			<tr height=\"11\"> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#1B0B73\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#1B0B73');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#4C379D\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#4C379D');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#876EBA\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#876EBA');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#BBBAEF\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#BBBAEF');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#008E37\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#008E37');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#26B168\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#26B168');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#47BE80\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#47BE80');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#76D3A2\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#76D3A2');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#B31C00\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#B31C00');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#B03F21\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#B03F21');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#AE623A\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#AE623A');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#AC6E54\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#AC6E54');\"></td> ";
		ctrlObj += " 			</tr> ";
		ctrlObj += " 			<tr height=\"11\"> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#FEFEFE\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#FEFEFE');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#E6E6E6\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#E6E6E6');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#CDCDCD\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#CDCDCD');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#B4B4B4\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#B4B4B4');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#A8A8A8\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#A8A8A8');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#8D8D8D\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#8D8D8D');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#747474\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#747474');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#595959\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#595959');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#4B4B4B\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#4B4B4B');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#303030\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#303030');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#0A0A0A\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#0A0A0A');\"></td> ";
		ctrlObj += " 			<td width=\"11\" bgcolor=\"#000000\" onClick=\"ziwooWysiwyg["+n+"].execCmd('backcolor', '#000000');\"></td> ";
		ctrlObj += " 			</tr> ";
		ctrlObj += " 			</table> ";
		ctrlObj += " 			</td> ";
		ctrlObj += " 		</table> ";
		ctrlObj += " 	</div> ";

		ctrlObj += " 	<div id=\"linkLayer"+n+"\" style=\"position:absolute; width:200px; border:1px solid #999999; display:none; background-color:white;\"> ";
		ctrlObj += " 		<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" bgcolor=\"#ffffff\" style=\"margin:10px;\"> ";
		ctrlObj += " 		<td><input type=\"text\" name=\"url\" value=\"http://\" style=\"width:140px; height:18px; border:1px solid #CCCCCC;\"><img src=\"./editor_images/ed_ok.gif\" style=\"margin-left:5px;\" align=\"absmiddle\" onClick=\"ziwooWysiwyg["+n+"].execLink(this.parentNode.firstChild.value);\"></td> ";
		ctrlObj += " 		</table> ";
		ctrlObj += " 	</div> ";

		ctrlObj += " 	<div id=\"tableInsertLayer"+n+"\" style=\"position:absolute; width:160px; border:1px solid #999999; display:none; background-color:white; padding:10px 10px 2px 10px; text-align:center\"> ";
		ctrlObj += " 		<table cellpadding=0 cellspacing=0 border=1 style=\"border:1px solid #999999; border-collapse:collapse;margin-bottom:3px;\"></table> ";
		ctrlObj += " 		<span style=\"font:9pt Arila\">0 x 0</span> ";
		ctrlObj += " 	</div> ";

		ctrlObj += " </td> ";
		ctrlObj += " </table> ";

		var iconDiv = document.createElement("div");	
		iconDiv.style.width = txObj.style.width;
		iconDiv.innerHTML = ctrlObj;
		edObj.parentNode.insertBefore(iconDiv,edObj);		

		var wTable = document.getElementById('tableInsertLayer'+n).getElementsByTagName("table")[0];
		var wSpan = document.getElementById('tableInsertLayer'+n).getElementsByTagName("span")[0];
		for(var r=0;r<10;r++){
			var wRow = wTable.insertRow(r);
			for(var c=0;c<15;c++){
				var wCell = wRow.insertCell(c);
				wCell.width = "10";
				wCell.height = "8";
				wCell.className = r+":"+c;
				wCell.onmouseover = function(){ 
					var r = parseInt(this.className.split(":")[0]);
					var c =parseInt(this.className.split(":")[1]);					
					wSpan.innerHTML = (c+1)+" x "+(r+1);
					for(var rr=0;rr<10;rr++){
						for(var cc=0;cc<15;cc++){
							wTable.rows[rr].cells[cc].style.backgroundColor = "#FFFFFF";
							if(rr<=r && cc<=c) wTable.rows[rr].cells[cc].style.backgroundColor = "#CCCCCC";
						}
					}
				}
				wCell.onclick = function(){ 
					var r = parseInt(this.className.split(":")[0]);
					var c = parseInt(this.className.split(":")[1]);
					ziwooWysiwyg[n].execTableInsert(c+1, r+1);
				}	
			}
		}

		// reSize
		var ctrlObj  = "<table id=\"resizeHandle"+n+"\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">";
		ctrlObj += "<td width=\""+txObj.style.width+"\" align=\"center\" bgcolor=\"#F0F0F0\" style=\"cursor:n-resize\" onmouseDown=\"ziwooWysiwyg["+n+"].msClick(event);\">";
		ctrlObj += "<img src=\"./editor_images/ed_resize.gif\" height=\"10\">";
		ctrlObj += "</td> ";
		ctrlObj += "</table> ";
		var bottomDiv = document.createElement("div");	
		bottomDiv.style.width = txObj.style.width;
		bottomDiv.innerHTML = ctrlObj;
		txObj.parentNode.insertBefore(bottomDiv,txObj);

		if(document.addEventListener){	
			document.addEventListener("mousemove", ziwooWysiwyg[n].msMove, false);
			document.addEventListener("mouseup", ziwooWysiwyg[n].msUp, false);
			edDoc.addEventListener("mousemove", ziwooWysiwyg[n].msMove, false);
			edDoc.addEventListener("mouseup", ziwooWysiwyg[n].msUp, false);
		}else if(document.attachEvent){
			document.attachEvent("onmousemove", ziwooWysiwyg[n].msMove);
			document.attachEvent("onmouseup", ziwooWysiwyg[n].msUp);
			edDoc.attachEvent("onmousemove", ziwooWysiwyg[n].msMove);
			edDoc.attachEvent("onmouseup", ziwooWysiwyg[n].msUp);
		}
		document.ondragstart = function(){return false;};
	}

	this.execCmd = function(excute, vlu){	
		edWin.focus();
		if(bookmarkSelection){
			var bookmarkRange = edDoc.selection.createRange();
			bookmarkRange.moveToBookmark(bookmarkSelection);
			bookmarkRange.select();
			bookmarkSelection = null;
		}
		if(!MSIE && excute=="backcolor") excute = "hilitecolor";
		edDoc.execCommand(excute, false, vlu);
		for (var i=0; i<layers.length; i++){ document.getElementById(layers[i]+n).style.display = "none"; }
	}

	this.execLink = function(vlu){
		edWin.focus();

		if(vlu == null || vlu == ""){
			alert("URL을 입력하세요.");
			return;
		}

		if(bookmarkSelection){
			var bookmarkRange = edDoc.selection.createRange();
			bookmarkRange.moveToBookmark(bookmarkSelection);
			bookmarkRange.select();
			bookmarkSelection = null;
		}

		var selText, selHTML;
		if(bookmarkRange){
			selText = bookmarkRange.text;
			selHTML = bookmarkRange.htmlText;
		}else if(window.getSelection){ // all browsers, except IE before version 9
			var selectionRange = edWin.getSelection();
			selText = selectionRange.toString();		
			if(selectionRange.rangeCount>0){ // similar to the htmlText property in Internet Explorer
				var range = selectionRange.getRangeAt(0);
				var docFragment = range.cloneContents();
				var dummyDiv = edDoc.createElement("div");
				dummyDiv.appendChild(docFragment);
				selHTML = dummyDiv.innerHTML;
			}
		}

		var html = "<a href=\""+vlu+"\" target=\"_blank\">"+selHTML+"</a>";
		try{
			if(bookmarkRange) bookmarkRange.pasteHTML(html);
			else edDoc.execCommand("inserthtml", false, html);
		}catch(e){
			alert("지원되지 않는 형식입니다.");
			return;
		}

		for (var i=0; i<layers.length; i++){ document.getElementById(layers[i]+n).style.display = "none"; }
	}

	this.execTableInsert = function(cols, rows){	
		edWin.focus();

		if(bookmarkSelection){
			var bookmarkRange = edDoc.selection.createRange();
			bookmarkRange.moveToBookmark(bookmarkSelection);
			bookmarkRange.select();
			bookmarkSelection = null;
		}

		var html = "<table width=\"100%\" border=\"1\" bordercolor=\"#CCCCCC\" style=\"border:1px solid #CCCCCC; border-collapse:collapse\"><tbody>";
		for(var x=0; x<rows; x++) {
			html += "<tr>";
				for(var y=0; y<cols; y++) html += (MSIE)?"<td></td>":"<td><br></td>";
			html += "</tr>";
		}
		html += "</tbody></table>";

		try{
			if(bookmarkRange) bookmarkRange.pasteHTML(html);	
			else edDoc.execCommand("inserthtml", false, html);	
		}catch(e){
			alert("지원되지 않는 형식입니다.");
		}
		for (var i=0; i<layers.length; i++){ document.getElementById(layers[i]+n).style.display = "none"; }
	}

	this.viewSource = function(){	
		var wysiwygBtn = document.getElementById('viewSourceBtn'+n).parentNode.childNodes;
		var regex=/ed_editor.gif|ed_html.gif/; 
		for(var i in wysiwygBtn){
			if(wysiwygBtn[i].nodeName=="IMG"){
				if(regex.test(wysiwygBtn[i].src)===false){
					if(MSIE) wysiwygBtn[i].style.filter = "Alpha(opacity=20)";
					else wysiwygBtn[i].style.opacity = 0.2;
				}
			}
			if(wysiwygBtn[i].nodeName=="A"){
				if(regex.test(wysiwygBtn[i].firstChild.src)===false){
					if(MSIE) wysiwygBtn[i].firstChild.style.filter = "Alpha(opacity=20)";
					else wysiwygBtn[i].firstChild.style.opacity = 0.2;
				}
			}
		}

		if(MSIE) edObj.style.display = "none";
		txObj.style.display = "inline";
		document.getElementById('viewSourceBtn'+n).style.display = "none";
		document.getElementById('viewEdirorBtn'+n).style.display = "inline";
		document.getElementById('resizeHandle'+n).style.display = "none";

		// textarea selectetion
		var startPoint = null;
		var selectedLength = null;
		if(document.selection){ // IE before version 9
			edWin.focus();
			var selectionRange = edDoc.selection.createRange();
			if(selectionRange.htmlText){
				var dummyDiv = document.createElement("div");
				dummyDiv.innerHTML = selectionRange.htmlText;
				var stripHTML = dummyDiv.innerHTML.replace(/(^(?:<[^<]+>)*|(?:<[^>]+>)*$)/ig, "");
				if(selectionRange.text.replace(/^\s+|\s+$/g,"") == "") stripHTML = dummyDiv.innerHTML;
				selectionRange.moveStart("character", -edDoc.body.innerHTML.length);
				dummyDiv = document.createElement("div");
				dummyDiv.innerHTML = selectionRange.htmlText;
				startPoint = dummyDiv.innerHTML.lastIndexOf(stripHTML);			

				var prevPos = (txObj.value.substring(0, startPoint+stripHTML.length).lastIndexOf(stripHTML));
				var nextPos = (txObj.value.substring(startPoint, txObj.value.length).indexOf(stripHTML));
				if(prevPos<0) prevPos = - txObj.value.length;
				if(nextPos<0) nextPos = txObj.value.length *2;
				txObj.focus();
				var inputRange = txObj.createTextRange();
				inputRange.collapse(true);
				if(nextPos==0){
					var enterCount = txObj.value.substring(0, startPoint).match(/\r\n/g);
					var enterGap = (enterCount)?enterCount.length : 0;
					inputRange.moveStart ("character", startPoint - enterGap);			
					inputRange.moveEnd ("character", stripHTML.length);
				}else if(startPoint-(prevPos)<nextPos){
					var enterCount = txObj.value.substring(0, prevPos).match(/\r\n/g);
					var enterGap = (enterCount)?enterCount.length : 0;
					inputRange.moveStart ("character", prevPos - enterGap);			
					inputRange.moveEnd ("character", stripHTML.length);
				}else{
					var enterCount = txObj.value.substring(0, startPoint + nextPos).match(/\r\n/g);
					var enterGap = (enterCount)?enterCount.length : 0;
					inputRange.moveStart ("character", startPoint + nextPos - enterGap);			
					inputRange.moveEnd ("character", stripHTML.length);
				}
				inputRange.select();
			}
		}else if(window.getSelection){ // all browsers, except IE before version 9	
			var selText = null;
			var selHTML = null;
			var selectionRange = edWin.getSelection();		
			selText = selectionRange.toString();	
			if(selectionRange.rangeCount>0){
				var range = selectionRange.getRangeAt(0);
				var docFragment = range.cloneContents();
				var dummyDiv = document.createElement("div");
				dummyDiv.appendChild(docFragment);
				selHTML = dummyDiv.innerHTML;
			}	
			if(selHTML){	
				edDoc.execCommand("inserthtml", false, selHTML+"z!z");
				startPoint = edDoc.body.innerHTML.indexOf(selHTML+"z!z");
				edDoc.body.innerHTML = edDoc.body.innerHTML.replace(/z!z/g,'');			
				var stripHTML = selHTML.replace(/(^(?:<[^<]+>)*|(?:<[^>]+>)*$)/ig, "");
				if(selText.replace(/^\s+|\s+$/g,"") == "") stripHTML = selHTML;
				if(stripHTML == "") stripHTML = selText;
				var prevPos = (txObj.value.substring(0, startPoint+stripHTML.length).lastIndexOf(stripHTML));
				var nextPos = (txObj.value.substring(startPoint, txObj.value.length).indexOf(stripHTML));
				if(prevPos<0) prevPos = - txObj.value.length;
				if(nextPos<0) nextPos = txObj.value.length *2;
				if(nextPos==0){
					txObj.selectionStart = startPoint;
					txObj.selectionEnd = startPoint+stripHTML.length;
				}else if(startPoint-(prevPos)<nextPos){
					txObj.selectionStart = prevPos;
					txObj.selectionEnd = prevPos+stripHTML.length;
				}else{
					txObj.selectionStart = startPoint + nextPos;
					txObj.selectionEnd = startPoint + nextPos + stripHTML.length;
				}
			}
		}

		txObj.focus();
		edObj.style.display = "none";
	}

	this.viewEdiror = function(){	
		var wysiwygBtn = document.getElementById('viewSourceBtn'+n).parentNode.childNodes;
		var regex=/ed_editor.gif|ed_html.gif/; 
		for(var i in wysiwygBtn){
			if(wysiwygBtn[i].nodeName=="IMG"){
				if(regex.test(wysiwygBtn[i].src)===false){
					if(MSIE) wysiwygBtn[i].style.filter = "Alpha(opacity=100)";
					else wysiwygBtn[i].style.opacity = 1.0;
				}
			}
			if(wysiwygBtn[i].nodeName=="A"){
				if(regex.test(wysiwygBtn[i].firstChild.src)===false){
					if(MSIE) wysiwygBtn[i].firstChild.style.filter = "Alpha(opacity=100)";
					else wysiwygBtn[i].firstChild.style.opacity = 1.0;
				}
			}
		}
		edObj.style.display = "inline";
		txObj.style.display = "none";
		document.getElementById('viewSourceBtn'+n).style.display = "inline";
		document.getElementById('viewEdirorBtn'+n).style.display = "none";
		document.getElementById('resizeHandle'+n).style.display = "block";
	}

	this.viewLayer = function(event, layerId){
		for (var i=0; i<layers.length; i++){ if(layers[i] != layerId) document.getElementById(layers[i]+n).style.display = "none"; }
		document.getElementById(layerId+n).style.display = (document.getElementById(layerId+n).style.display=="none")?"inline":"none";

		var el = event.srcElement ? event.srcElement : event.target; 
		var tmpOffset = el.getBoundingClientRect();
		document.getElementById(layerId+n).style.left = tmpOffset.left;

		if(document.selection){ // Internet Explorer and Opera before version 10.5
			edWin.focus();	
			var range = edDoc.selection.createRange();
			bookmarkSelection = range.getBookmark();
			window.focus();
		}	
	}

	this.hideLayer = function(){
		txObj.style.display = "none";
	}

	this.editor2source = function(){
		txObj.value = edDoc.body.innerHTML;
	}

	this.source2editor = function(){
		edDoc.body.innerHTML = txObj.value;
	}

	this.p2br = function(event){
		if(MSIE){
			var el = event.srcElement ? event.srcElement : event.target;
			if(event.keyCode == 13) { 
				var range = el.parentNode.parentNode.selection.createRange();
				range.pasteHTML(event.shiftKey? "<p>":"<br>"); 
				range.select();  
				return false;
			}
		}
	}

	// reSize	
	var startHeight, startTop, startY, mDown;
	this.msClick = function(event) {
		mDown = 1;
		startHeight = parseInt(edObj.style.height.replace("px",""));
		startTop = event.clientY + document.body.scrollTop;
		startY = event.clientY;
	}

	this.msMove = function(event){
		if(mDown==1){
			edObj.style.height = startHeight + (event.clientY + document.body.scrollTop) - startTop;
			if(parseInt(edObj.style.height.replace("px",""))<10){
				mDown = 0;
				edObj.style.height = 10;
			}
			return false;
		}
	}

	this.msUp = function(){
		mDown = 0;
	}
}
