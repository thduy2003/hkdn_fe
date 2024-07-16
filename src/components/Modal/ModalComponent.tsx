import { ModalComponentProps } from "@/interface/app"
import { Modal } from "antd"


export default function ModalComponent({open, setOpen, formContentRender, customFooter, customTitle}: ModalComponentProps) { 
  return <Modal title={customTitle ? customTitle() : <p>Form component</p>} open={open} footer={customFooter ? customFooter() : false} onCancel={() => setOpen(false)}>
   {formContentRender ? formContentRender() : <div>Form content.....</div>}
</Modal>
}