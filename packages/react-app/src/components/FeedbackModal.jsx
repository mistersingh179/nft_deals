import { Button, Col, Modal, Row } from 'antd'
import { TwitterTweetEmbed } from 'react-twitter-embed';

const FeedbackModal = props => {
  const { showFeedbackModal, setShowFeedbackModal } = props

  const handleOk = evt => { setShowFeedbackModal(false) }
  const handleCancel = evt => { setShowFeedbackModal(false) }
  const tweetEmbed = <>
        <TwitterTweetEmbed tweetId={'1518570484853526530'}/>
  </>

  return (
    <Modal
      className="winner-modal"
      closable={false}
      visible={showFeedbackModal}
      onOk={handleOk}
      onCancel={handleCancel}
    >
        {tweetEmbed}
    </Modal>
  )
}

export default FeedbackModal
