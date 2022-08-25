/**
 * v-watermark可接收参数，均为非必填
 * { text: 'vue-admin-box', font: '16px Microsoft JhengHei', textColor: '#000' }
 */
function addWaterMark(str, parentNode, font, textColor) {
    var can = document.createElement('canvas');
    parentNode.appendChild(can);
    can.width = 200;
    can.height = 150;
    can.style.display = 'none';
    var cans = can.getContext('2d');
    cans.rotate((-20 * Math.PI) / 180);
    cans.font = font || '16px Microsoft JhengHei';
    cans.fillStyle = textColor || 'rgba(180, 180, 180, 0.3)';
    cans.textAlign = 'left';
    cans.textBaseline = 'middle';
    cans.fillText(str || 'SL - Admin', can.width / 10, can.height / 2);
    parentNode.style.backgroundImage = 'url(' + can.toDataURL('image/png') + ')';
}
export default {
    mounted(el, binding) {
        binding.value ? binding.value : binding.value = {};
        addWaterMark(binding.value.text, el, binding.value.font, binding.value.textColor);
    }
}


