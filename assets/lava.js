/* Hành vi dùng chung: tìm nhà, chi tiết, đặt lịch, hiệu ứng. Dữ liệu là bản giữ chỗ. */
const NHA=[
 {id:'n1',nhu:'mua',loai:'Căn hộ',ten:'Căn hộ 3 phòng ngủ',khu:'TP.HCM',dc:'Phú Mỹ Hưng, Quận 7',gia:'8,2 tỷ',dt:96,pn:3,huong:'Đông Nam',phap:'Sổ hồng',img:'chung-cu',alt:'Toà chung cư ốp tấm tối nhìn từ dưới lên'},
 {id:'n2',nhu:'mua',loai:'Nhà phố',ten:'Nhà phố 4 tầng',khu:'Hà Nội',dc:'Dịch Vọng, Cầu Giấy',gia:'14,5 tỷ',dt:85,pn:4,huong:'Nam',phap:'Sổ đỏ',img:'nha-pho',alt:'Nhà phố hiện đại mặt ốp gỗ và sân cỏ trước nhà'},
 {id:'n3',nhu:'mua',loai:'Biệt thự',ten:'Biệt thự sân vườn',khu:'TP.HCM',dc:'Thảo Điền, TP Thủ Đức',gia:'42 tỷ',dt:320,pn:5,huong:'Đông',phap:'Sổ hồng',img:'nha-vuon',alt:'Biệt thự hai tầng sáng đèn lúc chiều tối, sân cỏ và cây lớn'},
 {id:'n4',nhu:'mua',loai:'Biệt thự',ten:'Biệt thự hồ bơi',khu:'Đà Nẵng',dc:'Ngũ Hành Sơn',gia:'36 tỷ',dt:300,pn:5,huong:'Đông Bắc',phap:'Sổ hồng',img:'biet-thu-ho-boi',alt:'Biệt thự trắng trần gỗ, hồ bơi phía trước'},
 {id:'n5',nhu:'mua',loai:'Căn hộ',ten:'Căn hộ 2 phòng ngủ',khu:'Đà Nẵng',dc:'Hải Châu',gia:'4,6 tỷ',dt:68,pn:2,huong:'Tây Nam',phap:'Sổ hồng',img:'phong-khach',alt:'Phòng khách sofa trắng, tường gỗ, bếp phía sau'},
 {id:'t1',nhu:'thue',loai:'Căn hộ',ten:'Căn hộ 1 phòng ngủ',khu:'TP.HCM',dc:'Bến Nghé, Quận 1',gia:'18 triệu/tháng',dt:45,pn:1,huong:'Đông',phap:'Hợp đồng 12 tháng',img:'phong-ngu',alt:'Phòng ngủ tường trắng, cửa kính cao nhìn ra cây'},
 {id:'t2',nhu:'thue',loai:'Căn hộ',ten:'Căn hộ 2 phòng ngủ',khu:'Hà Nội',dc:'Quảng An, Tây Hồ',gia:'25 triệu/tháng',dt:78,pn:2,huong:'Nam',phap:'Hợp đồng 12 tháng',img:'can-ho-nho',alt:'Căn hộ phòng khách liền bếp, ghế đỏ cạnh cửa sổ lớn'},
 {id:'t3',nhu:'thue',loai:'Nhà phố',ten:'Nhà phố 3 tầng',khu:'Đà Nẵng',dc:'An Hải Bắc, Sơn Trà',gia:'30 triệu/tháng',dt:120,pn:4,huong:'Đông Nam',phap:'Hợp đồng 24 tháng',img:'nha-trang',alt:'Nhà ba tầng trắng mái gỗ bên hồ nước'}
];
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const anh=(n,cls='',w=1400,h=933)=>`<img class="${cls}" src="assets/img/${n.img}.webp" alt="${n.alt}" width="${w}" height="${h}" loading="lazy">`;
const mau=window.LAVA_MAU;
let loc={loai:'',khu:''};

function vePhan(nhu){
  const dong=NHA.filter(n=>n.nhu===nhu&&(!loc.loai||n.loai===loc.loai)&&(!loc.khu||n.khu===loc.khu));
  const hop=$(`[data-list="${nhu}"]`);
  hop.hidden=!dong.length; hop.innerHTML=dong.map((n,i)=>mau(n,i)).join('');
  const rong=$(`[data-rong="${nhu}"]`);rong.hidden=!!dong.length;
  const nhan=[loc.loai,loc.khu&&`ở ${loc.khu}`].filter(Boolean).join(' ');
  const bl=$(`[data-boloc="${nhu}"]`);bl.hidden=!nhan;$('b',bl).textContent=nhan;
  $$('[data-len]',hop).forEach(e=>theoDoi.observe(e));
}
function veHet(){vePhan('mua');vePhan('thue')}
function xoaLoc(){loc={loai:'',khu:''};const f=$('[data-tim]');f.reset();veHet()}

const theoDoi=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('hien');theoDoi.unobserve(e.target)}}),{rootMargin:'0px 0px -12% 0px'});

$('[data-tim]').addEventListener('submit',e=>{
  e.preventDefault();const d=new FormData(e.target);
  loc={loai:d.get('loai'),khu:d.get('khu')};veHet();
  document.getElementById(d.get('nhu')==='thue'?'nha-cho-thue':'nha-ban').scrollIntoView();
});
$$('[data-xoa]').forEach(b=>b.addEventListener('click',xoaLoc));
$$('[data-khu]').forEach(a=>a.addEventListener('click',()=>{
  loc={loai:'',khu:a.dataset.khu};const f=$('[data-tim]');f.reset();f.elements.khu.value=a.dataset.khu;veHet();
}));

const hop=$('dialog.ct');
function moNha(id){
  const n=NHA.find(x=>x.id===id);
  hop.innerHTML=`<div class="ct-luoi">${anh(n)}<div class="ct-than"><h2>${n.ten}</h2><p class="ct-gia so">${n.gia}</p>
  <dl class="kv"><div><dt>Địa chỉ</dt><dd>${n.dc}, ${n.khu}</dd></div><div><dt>Diện tích</dt><dd class="so">${n.dt} m²</dd></div><div><dt>Phòng ngủ</dt><dd class="so">${n.pn}</dd></div><div><dt>Hướng</dt><dd>${n.huong}</dd></div><div><dt>${n.nhu==='thue'?'Thời hạn':'Pháp lý'}</dt><dd>${n.phap}</dd></div></dl>
  <div class="ct-nut"><button class="btn btn-phu" data-dong>Đóng</button><button class="btn" data-lich="${n.id}">Đặt lịch xem</button></div></div></div>`;
  hop.showModal();
}
document.addEventListener('click',e=>{
  const mo=e.target.closest('[data-nha]');if(mo){e.preventDefault();moNha(mo.dataset.nha);return}
  if(e.target.closest('[data-dong]')||e.target===hop){hop.close();return}
  const l=e.target.closest('[data-lich]');
  if(l){hop.close();const f=$('[data-dat]');f.elements.nha.value=l.dataset.lich;kiem();document.getElementById('dat-lich-xem').scrollIntoView()}
});

/* Đặt lịch */
const fd=$('[data-dat]'),nutDat=$('button[type=submit]',fd),lyDo=$('[data-lydo]'),kq=$('[data-kq]');
fd.elements.nha.innerHTML='<option value="">Chọn căn nhà</option>'+NHA.map(n=>`<option value="${n.id}">${n.ten}, ${n.dc}</option>`).join('');
const THU=['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
const ngayVN=d=>`${THU[d.getDay()]} ${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
fd.elements.ngay.innerHTML='<option value="">Chọn ngày</option>'+[1,2,3,4,5,6,7].map(i=>{const d=new Date();d.setDate(d.getDate()+i);return `<option>${ngayVN(d)}</option>`}).join('');
const sdtDung=v=>/^0\d{9}$/.test(v.replace(/\s/g,''));
function kiem(){
  const e=fd.elements,thieu=[];
  if(!e.nha.value)thieu.push('căn nhà');if(!e.ten.value.trim())thieu.push('họ tên');
  if(!sdtDung(e.sdt.value))thieu.push('số điện thoại');if(!e.ngay.value)thieu.push('ngày xem');
  nutDat.disabled=!!thieu.length;lyDo.textContent=thieu.length?`Còn thiếu ${thieu.join(', ')}`:'';
}
fd.addEventListener('input',kiem);fd.addEventListener('change',kiem);
const loiSdt=$('[data-loisdt]');
fd.elements.sdt.addEventListener('input',()=>{if(sdtDung(fd.elements.sdt.value)){fd.elements.sdt.setAttribute('aria-invalid',false);loiSdt.textContent=''}});
fd.elements.sdt.addEventListener('blur',()=>{const v=fd.elements.sdt.value,sai=v&&!sdtDung(v);fd.elements.sdt.setAttribute('aria-invalid',sai);loiSdt.textContent=sai?'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0':''});
fd.addEventListener('submit',e=>{
  e.preventDefault();kiem();if(nutDat.disabled)return;
  const n=NHA.find(x=>x.id===fd.elements.nha.value),now=new Date();
  $('.kv',kq).innerHTML=`<div><dt>Căn nhà</dt><dd>${n.ten}</dd></div><div><dt>Địa chỉ</dt><dd>${n.dc}, ${n.khu}</dd></div><div><dt>Ngày xem</dt><dd>${fd.elements.ngay.value}</dd></div><div><dt>Giờ xem</dt><dd class="so">${fd.elements.gio.value}</dd></div><div><dt>Đặt lúc</dt><dd class="so">${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}, ${ngayVN(now)}</dd></div>`;
  fd.hidden=true;kq.hidden=false;
});
function moLai(){fd.reset();fd.hidden=false;kq.hidden=true;kiem()}
$('[data-them]').addEventListener('click',moLai);
$('[data-xong]').addEventListener('click',()=>{moLai();window.scrollTo(0,0)});

/* Menu điện thoại */
const nav=$('.nav'),nm=$('.nut-menu');
nm.addEventListener('click',()=>{const m=nav.toggleAttribute('data-mo');nm.setAttribute('aria-expanded',m);nm.textContent=m?'Đóng':'Menu'});
$$('a',nav).forEach(a=>a.addEventListener('click',()=>{nav.removeAttribute('data-mo');nm.textContent='Menu';nm.setAttribute('aria-expanded',false)}));

/* Hiệu ứng theo cuộn: ghi tiến độ 0..1 vào --p */
const giam=matchMedia('(prefers-reduced-motion:reduce)').matches;
$$('[data-rise],[data-len]').forEach(e=>theoDoi.observe(e));
$$('[data-p]').forEach(e=>{if(giam)e.style.setProperty('--p',1)});
if(!giam&&$('[data-p]')){let cho=false;const tinh=()=>{cho=false;$$('[data-p]').forEach(e=>{const r=e.getBoundingClientRect(),h=innerHeight,p=Math.min(1,Math.max(0,(h-r.top)/(h*.9)));e.style.setProperty('--p',p.toFixed(3))})};addEventListener('scroll',()=>{if(!cho){cho=true;requestAnimationFrame(tinh)}},{passive:true});tinh()}

veHet();kiem();window.LAVA={NHA,moNha};
