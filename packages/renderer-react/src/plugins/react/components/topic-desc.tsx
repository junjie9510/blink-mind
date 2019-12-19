import { BlockType, FocusMode, OpType } from '@blink-mind/core';
import {TopicBlockIcon} from "@blink-mind/renderer-react";
import {
  Classes,
  Drawer,
  Popover,
  PopoverInteractionKind,
} from '@blueprintjs/core';
import debug from 'debug';
import * as React from 'react';
import styled from 'styled-components';
import {
  cancelEvent,
  Icon,
  iconClassName,
  IconName,
  RefKey
} from '../../../utils';

const log = debug('node:topic-desc');

const DescEditorWrapper = styled.div`
  overflow: auto;
  padding: 0px 0px 0px 20px;
  background: #88888850;
`;

const TooltipContentWrapper = styled.div`
  overflow: auto;
`;

export function TopicDesc(props) {
  const { controller, model, topicKey, getRef } = props;
  const isEditing = model.editingDescKey === topicKey;
  log('isEditing', isEditing);
  const onClick = e => {
    e.stopPropagation();
    controller.run('operation', {
      ...props,
      opType: OpType.START_EDITING_DESC
    });
  };

  const onDescEditorClose = e => {
    e.stopPropagation();
    const key = `topic-desc-data-${topicKey}`;
    const descData = controller.run('deleteTempValue', { key });
    controller.run('operation', {
      ...props,
      opType: OpType.SET_TOPIC_BLOCK,
      topicKey,
      blockType: BlockType.DESC,
      data: descData,
      focusMode: FocusMode.NORMAL,
    });
  };

  const desc = model.getTopic(topicKey).getBlock(BlockType.DESC);
  if (
    !isEditing &&
    controller.run('isBlockEmpty', { ...props, block: desc.block })
  )
    return null;
  const descEditor = controller.run('renderTopicDescEditor', props);
  const diagramRoot = getRef(RefKey.DIAGRAM_ROOT_KEY);
  const style = {
    maxWidth: '800px',
    maxHeight: '600px'
  };
  if (diagramRoot) {
    const dRect = diagramRoot.getBoundingClientRect();
    style.maxWidth = `${dRect.width * 0.6}px`;
    style.maxHeight = `${dRect.height * 0.8}px`;
  }
  const tooltipContent = (
    <TooltipContentWrapper
      onClick={cancelEvent}
      classname={Classes.POPOVER_DISMISS}
      style={style}
    >
      {descEditor}
    </TooltipContentWrapper>
  );
  const icon = (
    <TopicBlockIcon
      onClick={onClick}
      className={iconClassName(IconName.NOTES)}
      tabIndex={-1}
    />
  );
  const tooltipProps = {
    autoFocus: false,
    content: tooltipContent,
    target: icon,
    interactionKind: PopoverInteractionKind.HOVER,
    hoverOpenDelay: 500
  };

  const descIcon = desc.block && <Popover {...tooltipProps}></Popover>;
  return (
    <>
      {descIcon}
      <Drawer
        title="Edit Notes"
        icon={Icon('note')}
        isOpen={isEditing}
        hasBackdrop
        isCloseButtonShown={false}
        onClose={onDescEditorClose}
        size="70%"
      >
        <DescEditorWrapper>{descEditor}</DescEditorWrapper>
      </Drawer>
    </>
  );
}
