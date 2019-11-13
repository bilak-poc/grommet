import React from 'react';
import { compose } from 'recompose';
import styled, { withTheme } from 'styled-components';
import { FormClose } from 'grommet-icons';

import { defaultProps } from '../../default-props';

import { withFocus, withForwardRef } from '../hocs';
import { focusStyle } from '../../utils';

import { Anchor } from '../Anchor';
import { Box } from '../Box';
import { Button } from '../Button';
import { Keyboard } from '../Keyboard';
import { Stack } from '../Stack';
import { Text } from '../Text';

import { StyledFileInput } from './StyledFileInput';

const ControlBox = styled(Box)`
  cursor: pointer;
  ${props => props.focus && focusStyle}
`;

const FileInput = ({
  a11yTitle,
  focus,
  forwardRef,
  messages,
  theme,
  onChange,
  ...rest
}) => {
  const [hover, setHover] = React.useState();
  const [files, setFiles] = React.useState([]);
  const internalRef = React.useRef();

  return (
    <Keyboard
      onSpace={event => {
        if (event.currentTarget === event.target) {
          (forwardRef || internalRef).current.click();
        }
      }}
      onEnter={event => {
        if (event.currentTarget === event.target) {
          (forwardRef || internalRef).current.click();
        }
      }}
    >
      <Stack
        a11yTitle={a11yTitle}
        tabIndex={0}
        guidingChild="last"
        interactiveChild={files.length > 0 ? 'last' : 'first'}
        onClick={() => (forwardRef || internalRef).current.click()}
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        onFocus={() => setHover(false)}
        onBlur={() => setHover(false)}
      >
        <StyledFileInput
          ref={forwardRef || internalRef}
          tabIndex={-1}
          {...rest}
          type="file"
          onChange={event => {
            event.persist();
            const fileList = event.target.files;
            const nextFiles = [...files];
            for (let i = 0; i < fileList.length; i += 1) {
              nextFiles.push(fileList[i]);
            }
            setFiles(nextFiles);
            if (onChange) {
              onChange(event);
            }
          }}
        />

        <ControlBox
          border={{
            color: hover ? 'brand' : undefined,
            side: 'all',
            size: 'medium',
            style: 'dashed',
          }}
          align={files.length ? 'stretch' : 'center'}
          justify="center"
        >
          {files.length > 10 && (
            <Box direction="row" align="center" justify="between">
              <Text margin="small" weight="bold">
                {files.length} {messages.files || 'files'}
              </Text>
              <Button
                a11yTitle={messages.removeAll || 'remove all'}
                icon={<FormClose />}
                hoverIndicator
                onClick={event => {
                  event.stopPropagation();
                  setFiles([]);
                  (forwardRef || internalRef).current.focus();
                }}
              />
            </Box>
          )}
          {files.length > 0 &&
            files.length <= 10 &&
            files.map((file, index) => (
              <Box
                key={file.name}
                direction="row"
                align="center"
                justify="between"
              >
                <Text margin="small" weight="bold">
                  {file.name}
                </Text>
                <Button
                  a11yTitle={`${messages.remove || 'remove'} ${file.name}`}
                  icon={<FormClose />}
                  hoverIndicator
                  onClick={event => {
                    event.stopPropagation();
                    const nextFiles = [...files];
                    nextFiles.splice(index, 1);
                    setFiles(nextFiles);
                    (forwardRef || internalRef).current.focus();
                  }}
                />
              </Box>
            ))}
          {!files.length && (
            <Text margin="small">
              {rest.multiple
                ? messages.dropPromptMultiple || 'Drop files here or'
                : messages.dropPrompt || 'Drop file here or'}{' '}
              <Anchor label={messages.browse || 'browse'} />
            </Text>
          )}
        </ControlBox>
      </Stack>
    </Keyboard>
  );
};

FileInput.defaultProps = {
  messages: {
    browse: 'browse',
    dropPrompt: 'Drop file here or',
    dropPromptMultiple: 'Drop files here or',
    files: 'files',
    remove: 'remove',
    removeAll: 'remove all',
  },
};

Object.setPrototypeOf(FileInput.defaultProps, defaultProps);

let FileInputDoc;
if (process.env.NODE_ENV !== 'production') {
  FileInputDoc = require('./doc').doc(FileInput); // eslint-disable-line global-require
}
const FileInputWrapper = compose(
  withFocus(),
  withTheme,
  withForwardRef,
)(FileInputDoc || FileInput);

export { FileInputWrapper as FileInput };