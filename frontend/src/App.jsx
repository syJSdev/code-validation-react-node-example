import React, { useCallback } from 'react';
import { Route, Link, Switch, Redirect, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { VerficationBox } from 'components';

const App = () => {
  const history = useHistory();
  const handleSuccess = useCallback(() => {
    history.push('/success');
  }, [history]);

  return (
    <Container>
      <Switch>
        <Route exact path="/validation">
          <VerficationBox onSuccess={handleSuccess} />
        </Route>
        <Route exact path="/success">
          <Card style={{ width: '32rem', margin: '120px auto' }}>
            <Card.Body className="text-center">
              <h3>Success</h3>
              <Button as={Link} to="/validation" variant="outline-secondary" className="text-uppercase">
                Retry
              </Button>
            </Card.Body>
          </Card>
        </Route>
        <Redirect to="/validation" />
      </Switch>
    </Container>
  );
};

export default App;
