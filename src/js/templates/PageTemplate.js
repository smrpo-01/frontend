import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Article from 'grommet/components/Article';
import Footer from 'grommet/components/Footer';
import Header from 'grommet/components/Header';
import Section from 'grommet/components/Section';

/**
 * This is page template component.
 * Use it as basis for new page. This will ensure unified look across subpages.
 *
 * To render header/footer pass a node as a prop you want to render in header/footer.
 */
class PageTemplate extends Component {
  render() {
    const {
      header,
      footer,
      children
    } = this.props;

    return (
      <Article>
        {/* Renders header only when node is passed as prop */}
        {(header !== null) ? <Header>{header}</Header> : null}

        {/* Renders application content in a section */}
        <Section>
          {children}
        </Section>

        {/* Renders footer only when node is passed as prop */}
        {(footer !== null) ? <Footer>{footer}</Footer> : null}
      </Article>
    );
  }
}

PageTemplate.defaultProps = {
  children: null,
  header: null,
  footer: null
};

PageTemplate.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  header: PropTypes.node,
  footer: PropTypes.node
};

export default PageTemplate;
