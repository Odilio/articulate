import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import systemKeywords from 'systemKeywords';

const compareKeywords = (a, b) => {
  if (a.start < b.start) return -1;
  if (a.start > b.start) return 1;
  return 0;
};

const styles = {
  highlightedText: {
    '&:hover': {
      opacity: 1,
    },
    opacity: 0.9,
    color: 'white',
    padding: '2px 5px',
  },
};

const SingleHighlightedSaying = withStyles(styles)(props => {
  const { classes } = props;
  const keywords = [...props.keywords].sort(compareKeywords);
  const keyword = keywords.length > 0 ? keywords.splice(0, 1)[0] : null;
  let formattedElement = null;
  if (keyword) {
    const start = +keyword.start;
    const end = +keyword.end;
    const lastStart = +props.lastStart;
    const beforeTaggedText = props.text.substring(0, start - lastStart);
    const taggedText = props.text.substring(start - lastStart, end - lastStart);
    const afterTaggedText = props.text.substring(
      end - lastStart,
      props.text.length,
    );
    let filteredKeyword = props.agentKeywords.filter(
      agentKeyword => agentKeyword.keywordName === keyword.keyword,
    )[0];
    if (!filteredKeyword) {
      filteredKeyword = systemKeywords.filter(
        sysKeyword => sysKeyword.keywordName === keyword.keyword,
      )[0];
    }
    const highlightColor = filteredKeyword.uiColor;
    formattedElement = (
      <span key={`keywordTag_${props.keywordIndex}`}>
        <span key={`beforeKeywordTagText_${props.keywordIndex}`}>
          {beforeTaggedText}
        </span>
        <span
          key={`keywordTagText_${props.keywordIndex}`}
          className={classes.highlightedText}
          style={{
            backgroundColor: highlightColor,
          }}
        >
          {taggedText}
        </span>
        <SingleHighlightedSaying
          agentKeywords={props.agentKeywords}
          keywords={keywords}
          text={afterTaggedText}
          keywordIndex={props.keywordIndex + 1}
          lastStart={end}
        />
      </span>
    );
  } else {
    formattedElement = (
      <span key={`keywordTag_${props.keywordIndex}`}>{props.text}</span>
    );
  }
  return formattedElement;
});

SingleHighlightedSaying.propTypes = {
  agentKeywords: PropTypes.array,
  keywords: PropTypes.array,
  text: PropTypes.string,
  keywordIndex: PropTypes.number,
  lastStart: PropTypes.number,
};

export default SingleHighlightedSaying;
