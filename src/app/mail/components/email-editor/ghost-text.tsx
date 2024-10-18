import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

export default (props) => {
  return (
    <NodeViewWrapper as="span">
      <NodeViewContent className="!inline select-none text-gray-300" as="span">
        {props.node.attrs.content}
      </NodeViewContent>
    </NodeViewWrapper>
  );
};
