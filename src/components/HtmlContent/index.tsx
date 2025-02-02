export const HtmlContent = ({ htmlString }: {htmlString: string}) => {
  return (
    <span
      dangerouslySetInnerHTML={{ __html: htmlString }}
    />
  );
};