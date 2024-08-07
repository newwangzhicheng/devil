'use client'

import Progress from '@/components/Progress'
import useUpload, { UploadStatus } from '@/components/useUpload'

// 这个文件太长了，拆一下
/**
 * 优化:
 * 上传拆解到useUpload.ts中
 */

export default function FileUploader(props: {
  file: File
  className?: string
}) {
  // 文件上传
  const {
    upload,
    status,
    calcHashRatio,
    setCalcHashRatio,
    requestPool,
    setRequestPool,
    uploadStatus,
    setUploadStatus
  } = useUpload(props.file)

  // 重置状态
  const reset = (): void => {
    setRequestPool(undefined)
    setCalcHashRatio(0)
  }

  // 开始上传时
  const handleStartUpload = async (): Promise<void> => {
    setUploadStatus(UploadStatus.Uploading_LocalProcessing)
    const uploadSuccess: boolean = await upload()
    setUploadStatus(
      uploadSuccess
        ? UploadStatus.NotStart_HasFile
        : UploadStatus.Uploaded_Success
    )
    if (uploadSuccess) {
      // 上传成功重置状态
      reset()
      setUploadStatus(UploadStatus.Uploaded_Success)
    } else {
      // 上传失败重置状态
      reset()
      setUploadStatus(UploadStatus.Uploaded_Failed)
    }
  }

  // 暂停时
  const handlePause = () => {
    console.log('requestPool', requestPool)
    requestPool!.pause()
    setUploadStatus(UploadStatus.Uploading_Pause)
  }

  // 继续上传时
  const handleGoOn = () => {
    requestPool!.continue()
    setUploadStatus(UploadStatus.Uploading_UploadChunks)
  }

  // 上传状态表
  const uploadActionMap: any = {
    '-1': {
      label: '重新上传',
      action: handleStartUpload
    },
    '1': {
      label: '上传',
      action: handleStartUpload
    },
    '2': {
      label: '处理中...',
      action: () => {}
    },
    '5': {
      label: '暂停',
      action: handlePause
    },
    '3': {
      label: '继续',
      action: handleGoOn
    }
  }

  return (
    <div className={['flex flex-col space-y-4', props.className].join(' ')}>
      {/* 这看起来不支持多文件并发上传 */}
      {/* 改一下吧 */}
      {/* 优化：支持多文件 */}
      <p>{status}</p>
      {uploadActionMap[uploadStatus] && (
        <button
          className="border-white border-2 rounded-full px-2 py-1 w-28"
          onClick={uploadActionMap[uploadStatus].action}
        >
          {uploadActionMap[uploadStatus].label}
        </button>
      )}
      {props.file && (
        <>
          <Progress ratio={calcHashRatio} className="w-60 max-w-full" />
          <p>{props.file.name}</p>
        </>
      )}
    </div>
  )
}
