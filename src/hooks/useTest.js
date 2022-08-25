//https://blog.csdn.net/weixin_34865745/article/details/113992767
import { onMounted, ref } from 'vue'
export default function () {
  const ref1 = ref('hookdata')
  const ref2 = ref('hookdataref2')
  onMounted(() => {})
  const hooksFunc = () => {
    alert('I am the method in the hook')
    return 'hook method executed'
  }
  return {
    ref1,
    ref2,
    hooksFunc
  }
}
