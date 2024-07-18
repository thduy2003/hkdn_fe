import { ModalComponentProps } from "@/interface/app"
import { Modal } from "antd"


export default function ModalComponent({open, setOpen, formContentRender, customFooter, customTitle, onCancel}: ModalComponentProps) { 
  return <Modal title={customTitle ? customTitle() : <p>Form component</p>} open={open} footer={customFooter ? customFooter() : false} onCancel={onCancel ? onCancel : () => setOpen(false)}>
   {formContentRender ? formContentRender() : <div>Form content.....</div>}
</Modal>
}