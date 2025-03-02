import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { fireEvent, screen, describeConformance } from '@mui/monorepo/test/utils';
import { MonthPicker, monthPickerClasses as classes } from '@mui/x-date-pickers/MonthPicker';
import {
  adapterToUse,
  wrapPickerMount,
  createPickerRenderer,
} from '../../../../test/utils/pickers-utils';

describe('<MonthPicker />', () => {
  const { render } = createPickerRenderer();

  describeConformance(
    <MonthPicker
      minDate={adapterToUse.date('2019-01-01T00:00:00.000')}
      maxDate={adapterToUse.date('2029-01-01T00:00:00.000')}
      date={adapterToUse.date()}
      onChange={() => {}}
    />,
    () => ({
      classes,
      inheritComponent: 'div',
      render,
      wrapMount: wrapPickerMount,
      muiName: 'MuiMonthPicker',
      refInstanceof: window.HTMLDivElement,
      // cannot test reactTestRenderer because of required context
      skip: [
        'componentProp',
        'componentsProp',
        'propsSpread',
        'reactTestRenderer',
        'themeVariants',
      ],
    }),
  );

  it('allows to pick year standalone', () => {
    const onChangeMock = spy();
    render(
      <MonthPicker
        minDate={adapterToUse.date('2019-01-01T00:00:00.000')}
        maxDate={adapterToUse.date('2029-01-01T00:00:00.000')}
        date={adapterToUse.date('2019-02-02T00:00:00.000')}
        onChange={onChangeMock}
      />,
    );

    fireEvent.click(screen.getByText('May', { selector: 'button' }));
    expect((onChangeMock.args[0][0] as Date).getMonth()).to.equal(4); // month index starting from 0
  });

  it('does not allow to pick months out of range', () => {
    const onChangeMock = spy();
    render(
      <MonthPicker
        minDate={adapterToUse.date('2020-04-01T00:00:00.000')}
        maxDate={adapterToUse.date('2020-06-01T00:00:00.000')}
        date={adapterToUse.date('2020-04-02T00:00:00.000')}
        onChange={onChangeMock}
      />,
    );

    fireEvent.click(screen.getByText('Mar', { selector: 'button' }));
    expect(onChangeMock.callCount).to.equal(0);

    fireEvent.click(screen.getByText('Apr', { selector: 'button' }));
    expect(onChangeMock.callCount).to.equal(1);
    expect((onChangeMock.args[0][0] as Date).getMonth()).to.equal(3); // month index starting from 0

    fireEvent.click(screen.getByText('Jul', { selector: 'button' }));
    expect(onChangeMock.callCount).to.equal(1);
  });

  it('does not allow to pick months if readOnly prop is passed', () => {
    const onChangeMock = spy();
    render(
      <MonthPicker
        minDate={adapterToUse.date('2019-01-01T00:00:00.000')}
        maxDate={adapterToUse.date('2029-01-01T00:00:00.000')}
        date={adapterToUse.date('2019-02-02T00:00:00.000')}
        onChange={onChangeMock}
        readOnly
      />,
    );

    fireEvent.click(screen.getByText('Mar', { selector: 'button' }));
    expect(onChangeMock.callCount).to.equal(0);

    fireEvent.click(screen.getByText('Apr', { selector: 'button' }));
    expect(onChangeMock.callCount).to.equal(0);

    fireEvent.click(screen.getByText('Jul', { selector: 'button' }));
    expect(onChangeMock.callCount).to.equal(0);
  });

  it('does not allow to pick months if disabled prop is passed', () => {
    const onChangeMock = spy();
    render(
      <MonthPicker
        minDate={adapterToUse.date('2019-01-01T00:00:00.000')}
        maxDate={adapterToUse.date('2029-01-01T00:00:00.000')}
        date={adapterToUse.date('2019-02-02T00:00:00.000')}
        onChange={onChangeMock}
        disabled
      />,
    );

    fireEvent.click(screen.getByText('Mar', { selector: 'button' }));
    expect(onChangeMock.callCount).to.equal(0);

    fireEvent.click(screen.getByText('Apr', { selector: 'button' }));
    expect(onChangeMock.callCount).to.equal(0);

    fireEvent.click(screen.getByText('Jul', { selector: 'button' }));
    expect(onChangeMock.callCount).to.equal(0);
  });

  it('clicking on a PickersMonth button should not trigger the form submit', () => {
    const onSubmitMock = spy();
    render(
      <form onSubmit={onSubmitMock}>
        <MonthPicker
          minDate={adapterToUse.date('2019-01-01T00:00:00.000')}
          maxDate={adapterToUse.date('2029-01-01T00:00:00.000')}
          date={adapterToUse.date('2019-02-02T00:00:00.000')}
          onChange={() => {}}
        />
      </form>,
    );

    fireEvent.click(screen.getByText('Mar', { selector: 'button' }));
    expect(onSubmitMock.callCount).to.equal(0);
  });

  it('does not allow to pick months if disabled by shouldDisableMonth', () => {
    const onChangeMock = spy();
    render(
      <MonthPicker
        minDate={adapterToUse.date('2019-01-01T00:00:00.000')}
        maxDate={adapterToUse.date('2020-01-01T00:00:00.000')}
        date={adapterToUse.date('2019-02-02T00:00:00.000')}
        onChange={onChangeMock}
        shouldDisableMonth={(month: Date) => {
          return adapterToUse.getYear(month) === 2019 && adapterToUse.getMonth(month) === 5;
        }}
      />,
    );

    fireEvent.click(screen.getByText('Apr', { selector: 'button' }));
    expect(onChangeMock.callCount).to.equal(1);

    fireEvent.click(screen.getByText('Jun', { selector: 'button' }));
    expect(onChangeMock.callCount).to.equal(1);

    fireEvent.click(screen.getByText('Jul', { selector: 'button' }));
    expect(onChangeMock.callCount).to.equal(2);
  });
});
