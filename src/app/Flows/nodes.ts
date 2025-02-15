import LinearGaugeNode from '../components/LinearGauge/LinearGaugeNode';
import TankNode from '../components/Tank/TankNode';
import { DataTrendNode } from '../components/DataTrend/DataTrendNode';
import MotorNode from '../components/Motors/MotorNode';
import ValveNode from '../components/Valves/ValveNode';
import { CardDataNode } from '../components/CardData/CardDataNode';
import { ControlDataCardNode } from '../components/ControlDataCard/ControlDataCardNode';
import { BoxCardNode } from '../components/Boxes/BoxNode';
import { Node, NodeTypes, Position } from 'reactflow';
import { thresholdsStyle } from '../components/LinearGauge/LinearGauge.style';
import { AlarmNode } from '../components/Alarm/AlarmNode';
import { LabelNode } from '../components/Label/LabelNode';
import { calculateSetPointBottom } from '../components/LinearGauge/LinearGauge.utils';
import { ButtonNode } from '../components/Button/ButtonNode';
import { SmallDataTrendNode } from '../components/SmallDataTrend/SmallDataTrendNode';

export const nodeTypes: NodeTypes = {
  linearGauge: LinearGaugeNode,
  tank: TankNode,
  dataTrendLine: DataTrendNode,
  motor: MotorNode,
  valve: ValveNode,
  card: CardDataNode,
  controlCard: ControlDataCardNode,
  box: BoxCardNode,
  alarm: AlarmNode,
  label: LabelNode,
  button: ButtonNode,
  smallDataTrend: SmallDataTrendNode,
};

const alarms = [
  {
    id: 'alarm1',
    type: 'alarm',
    position: { x: -15, y: -5 },
    data: { isActive: false, type: 'MEDIUM' },
    parentNode: 'lGauge2',
  },
  {
    id: 'alarm2',
    type: 'alarm',
    position: { x: -15, y: -5 },
    data: { isActive: false, type: 'MEDIUM' },
    parentNode: 'lGauge1',
  },
];

const dataTrends: Node[] = [
  {
    id: 'dataTrend1',
    type: 'dataTrendLine',
    position: { x: 10, y: 80 },
    data: {
      dataPoints: [
        34.1010101, 35.31313131, 32.88888889, 36.72847734, 32.09469669,
        34.68095356, 38.29900334, 39.19730021, 33.75597923, 36.48939697,
        38.83508672, 32.78889951, 32.72727273, 36.49364072, 32.48145158,
        33.85858586, 35.7067179, 32.03100171, 39.30910598, 36.18070242,
        39.99938861, 32.80808081, 34.67018852, 35.39393939, 32.56565657,
        32.5301124, 34.82828283, 33.6969697, 37.42221893, 37.1137505,
        38.09142015, 36.04040404, 35.18347564, 32.24242424, 37.25252525,
        32.96969697, 39.80656094, 35.96216828, 32.8930669, 35.7979798,
        36.13338152, 34.46911147, 38.95337239, 39.77759942, 33.33549892,
        34.71618197, 36.72847734, 37.8833916, 35.37166465, 33.43345556,
        33.14414302, 37.52849639, 39.64371973, 34.08284943, 34.68095356,
        33.97920562, 37.50932246, 39.57712183, 34.25672033, 37.5869094,
        38.09142015, 37.07470128, 39.76379943, 36.00640661,
      ],
      setPoint: 36,
      limitBottom: 32,
      limitTop: 40,
      yAxis: {
        min: 32,
        max: 40,
      },
      xAxis: {
        min: 0,
        max: 100,
      },
      title: 'Analysis: Purity %',
    },
    parentNode: 'tank',
  },
  {
    id: 'dataTrend2',
    type: 'dataTrendLine',
    position: { x: 10, y: 230 },
    data: {
      dataPoints: [
        5.248819651202467, 5.296915953553224, 4.779436919774891,
        5.663619325834442, 5.68767133897909, 5.529689852929465,
        5.688100046214597, 5.4785062275756795, 5.742311188491531,
        5.738698904788015, 5.8125764902659665, 5.928097273740872,
        5.2905637004605195, 4.966901584157109, 4.556842678684144,
        5.681879514307574, 4.3316514575198655, 4.86104702792404,
        4.843411333044294, 5.72915574507101, 5.685878306859603,
        4.577275563858546, 5.720329531668408, 5.832220661448421,
        4.221045029144385, 5.416798603981109, 5.001000563439714,
        4.3376510867163365, 5.841831705793335, 4.716184071082504,
        5.554617762163663, 5.119214071042215, 5.333505302171452,
        5.217826142357074, 4.463284894322672, 5.908174355815123,
        4.970837410923094, 5.660529343273655, 5.49,
      ],
      setPoint: 5,
      limitBottom: 4,
      limitTop: 6,
      yAxis: {
        min: 4,
        max: 6,
      },
      xAxis: {
        min: 0,
        max: 100,
      },
      title: 'Analysis: Inhibitor Concentration %',
    },
    parentNode: 'tank',
  },
  {
    id: 'dataTrend3',
    type: 'dataTrendLine',
    position: { x: 10, y: 150 },
    data: {
      dataPoints: [
        76.43467918792292, 74.75843990580947, 74.11102422374006,
        75.03375075333776, 74.2775842341375, 77.40147330305344,
        74.4968876088908, 74.15766420293915, 77.06466284761926,
        74.17522848585811, 77.24071168982606, 76.03170169580082,
        77.59330494812569, 75.83422473559085, 74.5575440883822,
        74.22029607152406, 75.9710475570913, 75.1224862186507,
        77.27191396165568, 77.68020605524305, 77.17260405773855,
        74.18733509535977, 74.68216320009611, 76.35013852685714,
        76.80563977046315, 77.85779658519459, 76.73356338517013,
        74.5226647731027, 74.43658093445504, 75.82498040480823,
      ],
      setPoint: 76,
      limitBottom: 74,
      limitTop: 78,
      yAxis: {
        min: 72,
        max: 80,
      },
      xAxis: {
        min: 0,
        max: 100,
      },
      title: 'Main Feed MPH',
    },
  },
  {
    id: 'dataTrend4',
    type: 'dataTrendLine',
    position: { x: 10, y: 420 },
    data: {
      dataPoints: [
        12.730336832141138, 12.604694698766734, 12.35465329649834,
        11.97566917248127, 12.757287309888397, 12.005853441267169,
        11.210677022719247, 12.272836976352318, 11.899780224253949,
        12.88100770210112, 12.01900863787708, 12.68870727210575,
        11.296239256518344, 11.411645600092339, 12.406272326928338,
        12.751908392233394, 12.864350492706093, 12.07894051496714,
        11.402549109651668, 12.283243922389508, 11.515874346541935,
        11.747219974109296, 12.612106043808122, 11.704755496032696,
        11.549276786052044, 12.509074178824557, 12.168556707870774,
        11.102990710718434, 11.35358350537714, 12.006868750373409,
      ],
      setPoint: 12,
      limitBottom: 11,
      limitTop: 13,
      yAxis: {
        min: 10,
        max: 14,
      },
      xAxis: {
        min: 0,
        max: 100,
      },
      title: 'Additive 1 MPH',
    },
  },
  {
    id: 'dataTrend5',
    type: 'dataTrendLine',
    position: { x: 10, y: 690 },
    data: {
      dataPoints: [
        3.2068142219054563, 3.089922086434573, 4.815543168783922,
        4.781487233844261, 4.690740298996385, 3.8765137673739485,
        3.399170543314184, 4.995146211503392, 4.575575595564803,
        3.72917781360293, 3.6892966746938947, 3.0436918744557873,
        3.5954640075412017, 3.193617419717274, 3.067402448799161,
        4.5737952823793595, 3.079184960517072, 4.425555099879878,
        3.7431046695146324, 3.150440449038093, 3.049271652536881,
        4.705338432714207, 4.258769151846447, 4.444730464118257,
        3.140791904147615, 3.329280019548973, 4.157909076744095,
        4.261435061130886, 4.673250410174235, 4.753499171846546,
      ],
      setPoint: 4,
      limitBottom: 2.9,
      limitTop: 5.5,
      yAxis: {
        min: 2,
        max: 6,
      },
      xAxis: {
        min: 0,
        max: 100,
      },
      title: 'Additive 2 MPH',
    },
  },
  {
    id: 'dataTrend6',
    type: 'dataTrendLine',
    position: { x: 900, y: 670 },
    data: {
      dataPoints: [
        46.991646664511805, 46.80082086423235, 45.93282304614595,
        46.31044035251841, 45.91554156496618, 43.28122256831383,
        43.49725137037665, 44.076421876971956, 43.351189280504535,
        46.22068529670941, 45.29317774371404, 46.812171308603254,
        44.07996995031121, 45.537321128937165, 43.65454569197852,
        46.21796287308248, 44.353304718707946, 46.01050298617181,
        44.03296653213907, 45.17685319833875, 46.18452644815724,
        46.051512963757126, 45.74029429236754, 44.719799522732565,
        46.22044041643755, 43.94027595995917, 45.26255339939316,
        45.447061152169454, 43.34263758684968, 43.37649658585457,
      ],
      setPoint: 45.5,
      limitBottom: 42,
      limitTop: 47,
      yAxis: {
        min: 40,
        max: 48,
      },
      xAxis: {
        min: 0,
        max: 100,
      },
      title: 'Temperature °C',
    },
  },
  {
    id: 'dataTrend7',
    type: 'smallDataTrend',
    position: { x: 860, y: 200 },
    data: {
      data: [
        34.71618197, 36.72847734, 37.8833916, 35.37166465, 33.43345556,
        33.14414302, 37.52849639, 39.64371973, 34.08284943, 34.68095356,
        33.97920562, 37.50932246, 39.57712183, 34.25672033, 37.5869094,
        38.09142015, 37.07470128, 39.76379943, 36.00640661,
      ],
      width: 80,
      height: 30,
      min: 35,
      max: 37.5,
    },
  },
  {
    id: 'dataTrend8',
    type: 'smallDataTrend',
    position: { x: 860, y: 295 },
    data: {
      data: [
        4.3376510867163365, 5.841831705793335, 4.716184071082504,
        5.554617762163663, 5.119214071042215, 5.333505302171452,
        5.217826142357074, 4.463284894322672, 5.908174355815123,
        4.970837410923094, 5.660529343273655, 5.49,
      ],
      width: 80,
      height: 30,
      min: 4.8,
      max: 5.3,
    },
  },
];

const navButtons: Node[] = [
  {
    id: 'buttonCard1',
    type: 'card',
    position: { x: 30, y: 900 },
    data: { label: ['Main', 'Menu'] },
  },
  {
    id: 'buttonCard2',
    type: 'card',
    position: { x: 160, y: 900 },
    data: { label: ['Level 1', 'Reaction', 'Overview'] },
  },
  {
    id: 'buttonCard3',
    type: 'card',
    position: { x: 290, y: 900 },
    data: { label: ['Trend', 'Control'] },
  },
  {
    id: 'buttonCard4',
    type: 'card',
    position: { x: 420, y: 900 },
    data: { label: ['Feed', 'System'] },
  },
  {
    id: 'buttonCard5',
    type: 'card',
    position: { x: 550, y: 900 },
    data: { label: ['Product', 'Recovery'] },
  },
  {
    id: 'buttonCard6',
    type: 'card',
    position: { x: 680, y: 900 },
    data: { label: ['M5', 'Startup', 'Overlay'] },
  },
  {
    id: 'buttonCard7',
    type: 'card',
    position: { x: 810, y: 900 },
    data: { label: ['M5', 'Sequence', 'Overlay'] },
  },
  {
    id: 'buttonCard8',
    type: 'card',
    position: { x: 940, y: 900 },
    data: { label: ['- Level 3 -', 'M5', 'Interlocks'] },
  },
  {
    id: 'buttonCard9',
    type: 'card',
    position: { x: 1070, y: 900 },
    data: { label: ['- Level 3 -', 'Cooling', 'System'] },
  },
];

const controlCards: Node[] = [
  {
    id: 'controlCard1',
    type: 'controlCard',
    position: { x: 30, y: 50 },
    data: {
      title: 'Main Feed',
      processVariableValue: 78.8,
      processVariable: 'MPH',
      setPoint: 76,
      output: 88.5,
      mode: 'AUTO',
      handleDataSource: {
        position: Position.Right,
        id: 'card1handleSource',
        style: {
          top: 90,
          bottom: 100,
          left: 100,
          right: 100,
        },
      },
      handleDataTarget: {
        position: Position.Right,
        id: 'card1handleDataTarget',
        style: {
          top: 21,
          bottom: 100,
          left: 100,
          right: 100,
        },
      },
    },
  },
  {
    id: 'controlCard2',
    type: 'controlCard',
    position: { x: 30, y: 320 },
    data: {
      title: 'Additive 1',
      processVariableValue: 11.9,
      processVariable: 'MPH',
      setPoint: 12,
      output: 22.3,
      mode: 'AUTO',
      handleDataSource: {
        position: Position.Right,
        id: 'card2handleSource',
        style: {
          top: 90,
          bottom: 100,
          left: 100,
          right: 100,
        },
      },
      handleDataTarget: {
        position: Position.Right,
        id: 'card2handleDataTarget',
        style: {
          top: 21,
          bottom: 100,
          left: 100,
          right: 100,
        },
      },
    },
  },
  {
    id: 'controlCard3',
    type: 'controlCard',
    position: { x: 30, y: 590 },
    data: {
      title: 'Additive 2',
      processVariableValue: 4.0,
      processVariable: 'MPH',
      setPoint: 4.0,
      output: 44.3,
      mode: 'AUTO',
      handleDataSource: {
        position: Position.Right,
        id: 'card3handleSource',
        style: {
          top: 90,
          bottom: 100,
          left: 100,
          right: 100,
        },
      },
      handleDataTarget: {
        position: Position.Right,
        id: 'card3handleDataTarget',
        style: {
          top: 21,
          bottom: 100,
          left: 100,
          right: 100,
        },
      },
    },
  },
  {
    id: 'controlCard4',
    type: 'controlCard',
    position: { x: 850, y: 80 },
    data: {
      title: 'M5 Pressure',
      processVariableValue: 98.0,
      processVariable: 'psg',
      setPoint: 95.0,
      output: 44.3,
      mode: 'AUTO',
      handleDataSource: {
        position: Position.Left,
        id: 'card4handleSource',
        style: {
          top: 60,
        },
      },
      handleDataTarget: {
        position: Position.Left,
        id: 'card4handleDataTarget',
        style: {
          top: 70,
        },
      },
    },
  },
  {
    id: 'controlCard5',
    type: 'controlCard',
    position: { x: 850, y: 340 },
    data: {
      title: 'M5 Level %',
      processVariableValue: 71.0,
      processVariable: '%',
      setPoint: 70.0,
      output: 54.3,
      mode: 'AUTO',
      handleDataSource: {
        position: Position.Right,
        id: 'card5handleSource',
        style: {
          top: 100,
        },
      },
      handleDataTarget: {
        position: Position.Left,
        id: 'card5handleDataTarget',
        style: {
          top: 100,
        },
      },
    },
  },
  {
    id: 'controlCard6',
    type: 'controlCard',
    position: { x: 800, y: 700 },
    data: {
      title: 'M5 Temp',
      processVariableValue: 45.0,
      processVariable: '°C',
      setPoint: 45.0,
      output: 54.3,
      mode: 'AUTO',
      handleDataSource: {
        position: Position.Left,
        id: 'card6handleSource',
        style: {
          top: 22,
        },
      },
      handleDataTarget: {
        position: Position.Left,
        id: 'card6handleDataTarget',
        style: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
      },
    },
  },
];

const valves: Node[] = [
  {
    id: 'valve1',
    type: 'valve',
    position: { x: 200, y: 100 },
    data: {
      valveType: 'round',
      rotation: 0,
      state: 'Open',
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'valve_1_target_1',
          style: {
            top: 40,
          },
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'valve_1_source_1',
          style: {
            top: 40,
          },
        },
        {
          type: 'source',
          position: Position.Top,
          id: 'valve_1_source_2',
          style: {
            bottom: 10,
          },
        },
      ],
    },
  },
  {
    id: 'valve2',
    type: 'valve',
    position: { x: 300, y: 100 },
    data: {
      valveType: 'rect',
      rotation: 0,
      state: 'Open',
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'valve_2_target_1',
          style: {
            top: 40,
          },
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'valve_2_source_1',
          style: {
            top: 40,
          },
        },
      ],
    },
  },
  {
    id: 'valve3',
    type: 'valve',
    position: { x: 200, y: 370 },
    data: {
      valveType: 'round',
      rotation: 0,
      state: 'Open',
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'valve_3_target_1',
          style: {
            top: 40,
          },
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'valve_3_source_1',
          style: {
            top: 40,
          },
        },
        {
          type: 'source',
          position: Position.Top,
          id: 'valve_3_source_2',
          style: {
            bottom: 10,
          },
        },
      ],
    },
  },
  {
    id: 'valve4',
    type: 'valve',
    position: { x: 300, y: 370 },
    data: {
      valveType: 'rect',
      rotation: 0,
      state: 'Open',
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'valve_4_target_1',
          style: {
            top: 40,
          },
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'valve_4_source_1',
          style: {
            top: 40,
          },
        },
      ],
    },
  },
  {
    id: 'valve5',
    type: 'valve',
    position: { x: 200, y: 640 },
    data: {
      valveType: 'round',
      rotation: 0,
      state: 'Open',
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'valve_5_target_1',
          style: {
            top: 40,
          },
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'valve_5_source_1',
          style: {
            top: 40,
          },
        },
        {
          type: 'source',
          position: Position.Top,
          id: 'valve_5_source_2',
          style: {
            bottom: 10,
          },
        },
      ],
    },
  },
  {
    id: 'valve6',
    type: 'valve',
    position: { x: 300, y: 640 },
    data: {
      valveType: 'rect',
      rotation: 0,
      state: 'Open',
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'valve_6_target_1',
          style: {
            top: 40,
          },
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'valve_6_source_1',
          style: {
            top: 40,
          },
        },
      ],
    },
  },
  {
    id: 'valve7',
    type: 'valve',
    position: { x: 730, y: 700 },
    data: {
      valveType: 'round',
      rotation: 90,
      state: 'Open',
      handles: [
        {
          type: 'target',
          position: Position.Right,
          id: 'valve_7_target_1',
          style: {
            top: 25,
          },
        },
        {
          type: 'target',
          position: Position.Top,
          id: 'valve_7_target_2',
          style: {
            left: 10,
          },
        },
        {
          type: 'source',
          position: Position.Bottom,
          id: 'valve_7_source_2',
          style: {
            left: 10,
          },
        },
      ],
    },
  },
  {
    id: 'valve8',
    type: 'valve',
    position: { x: 900, y: 500 },
    data: {
      valveType: 'round',
      rotation: 90,
      state: 'Open',
      handles: [
        {
          type: 'source',
          position: Position.Right,
          id: 'valve_8_source_1',
          style: {
            top: 25,
          },
        },
        {
          type: 'source',
          position: Position.Top,
          id: 'valve_8_source_2',
          style: {
            left: 10,
          },
        },
        {
          type: 'target',
          position: Position.Bottom,
          id: 'valve_8_target_2',
          style: {
            left: 10,
          },
        },
      ],
    },
  },
  {
    id: 'valve9',
    type: 'valve',
    position: { x: 800, y: 30 },
    data: {
      valveType: 'round',
      rotation: 180,
      state: 'Open',
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'valve_9_target_1',
          style: {
            top: 15,
          },
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'valve_9_source_1',
          style: {
            top: 15,
          },
        },
        {
          type: 'target',
          position: Position.Bottom,
          id: 'valve_9_target_2',
          style: {
            bottom: -8,
          },
        },
      ],
    },
  },
  {
    id: 'valve10',
    type: 'valve',
    position: { x: 1000, y: 550 },
    data: {
      valveType: 'round',
      rotation: 0,
      state: 'Open',
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'valve_10_target_1',
          style: {
            top: 40,
          },
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'valve_10_source_1',
          style: {
            top: 40,
          },
        },
        {
          type: 'target',
          position: Position.Top,
          id: 'valve_10_target_2',
          style: {
            bottom: 10,
          },
        },
      ],
    },
  },
];

const gauges = [
  {
    id: 'lGauge1',
    type: 'linearGauge',
    position: { x: 15, y: 20 },
    data: {
      value: -1,
      setPoint: calculateSetPointBottom(35, -20, 90),
      alarmStatus: false,
      thresholds: thresholdsStyle(
        [
          { max: -20, classColor: '', identifier: 'Normal' },
          { max: -10, classColor: '', identifier: 'High Priority Alarm' },
          { max: 0, classColor: '', identifier: 'Medium Priority Alarm' },
          { max: 70, classColor: '', identifier: 'Normal' },
          { max: 90, classColor: '', identifier: 'Medium Priority Alarm' },
        ],
        false
      ),
      units: 'Coolant Flow',
      height: 220,
    },
    parentNode: 'boxLinearGauges',
  },
  {
    id: 'lGauge2',
    type: 'linearGauge',
    position: { x: 80, y: 20 },
    data: {
      value: 0,
      setPoint: calculateSetPointBottom(50, 0, 100),
      alarmStatus: false,
      thresholds: thresholdsStyle(
        [
          { max: 0, classColor: '', identifier: 'Normal' },
          { max: 30, classColor: '', identifier: 'Medium Priority Alarm' },
          { max: 70, classColor: '', identifier: 'Normal' },
          { max: 80, classColor: '', identifier: 'Medium Priority Alarm' },
          { max: 100, classColor: '', identifier: 'High Priority Alarm' },
        ],
        false
      ),
      units: 'Coolant Temp',
      height: 220,
    },
    parentNode: 'boxLinearGauges',
  },
  {
    id: 'lGauge3',
    type: 'linearGauge',
    position: { x: 145, y: 20 },
    data: {
      value: 37,
      setPoint: calculateSetPointBottom(60, -20, 100),
      alarmStatus: false,
      thresholds: thresholdsStyle(
        [
          { max: 0, classColor: '', identifier: 'Normal' },
          { max: 20, classColor: '', identifier: 'Medium Priority Alarm' },
          { max: 70, classColor: '', identifier: 'Normal' },
          { max: 90, classColor: '', identifier: 'Medium Priority Alarm' },
        ],
        false
      ),
      units: 'Purge Rate',
      height: 220,
    },
    parentNode: 'boxLinearGauges',
  },
  {
    id: 'lGauge4',
    type: 'linearGauge',
    position: { x: 210, y: 20 },
    data: {
      value: 45,
      setPoint: calculateSetPointBottom(50, -20, 100),
      alarmStatus: false,
      thresholds: thresholdsStyle(
        [
          { max: 0, classColor: '', identifier: 'Normal' },
          { max: 70, classColor: '', identifier: 'Normal' },
          { max: 100, classColor: '', identifier: 'Medium Priority Alarm' },
        ],
        false
      ),
      units: 'Conversion Efficiency',
      height: 220,
    },
    parentNode: 'boxLinearGauges',
  },
  {
    id: 'lGauge5',
    type: 'linearGauge',
    position: { x: 275, y: 20 },
    data: {
      value: 66,
      alarmStatus: false,
      thresholds: thresholdsStyle(
        [
          { max: -30, classColor: '', identifier: 'Normal' },
          { max: -20, classColor: '', identifier: 'High Priority Alarm' },
          { max: -10, classColor: '', identifier: 'Medium Priority Alarm' },
          { max: 70, classColor: '', identifier: 'Normal' },
          { max: 90, classColor: '', identifier: 'Medium Priority Alarm' },
          { max: 100, classColor: '', identifier: 'High Priority Alarm' },
        ],
        false
      ),
      units: 'Cat. Activity',
      height: 220,
    },
    parentNode: 'boxLinearGauges',
  },
  {
    id: 'lGauge6',
    type: 'linearGauge',
    position: { x: 325, y: 105 },
    data: {
      value: 30,
      alarmStatus: false,
      thresholds: thresholdsStyle(
        [
          { max: -30, classColor: '', identifier: 'Normal' },
          { max: -20, classColor: '', identifier: 'High Priority Alarm' },
          { max: -10, classColor: '', identifier: 'Medium Priority Alarm' },
          { max: 70, classColor: '', identifier: 'Normal' },
          { max: 90, classColor: '', identifier: 'Medium Priority Alarm' },
          { max: 100, classColor: '', identifier: 'High Priority Alarm' },
        ],
        false
      ),
      units: 'lt',
      height: 280,
      bottom: 10,
    },
    parentNode: 'tank',
  },
];

export const PIDNodes: Node[] = [
  ...dataTrends,
  ...navButtons,
  ...controlCards,
  ...valves,
  ...gauges,
  ...alarms,
  {
    id: 'tank',
    type: 'tank',
    position: { x: 400, y: 40 },
    style: { zIndex: -40 },
    data: {
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'tankTarget1',
          style: {
            top: 100,
          },
        },
        {
          type: 'target',
          position: Position.Left,
          id: 'tankTarget2',
          style: {
            top: 370,
          },
        },
        {
          type: 'target',
          position: Position.Left,
          id: 'tankTarget3',
          style: {
            top: 390,
          },
        },
        {
          type: 'source',
          position: Position.Bottom,
          id: 'tankTarget4',
          style: {
            top: 445,
            left: 340,
          },
        },
        {
          type: 'source',
          position: Position.Bottom,
          id: 'tankTarget5',
          style: {
            top: 445,
            left: 360,
          },
        },
        {
          type: 'target',
          position: Position.Right,
          id: 'tankTarget6',
          style: {
            top: 425,
          },
        },
        {
          type: 'source',
          position: Position.Top,
          id: 'tankSource5',
          style: {
            left: 290,
            top: 25,
          },
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'tankSource6',
          style: {
            top: 400,
          },
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'tankSource7',
          style: {
            top: 110,
          },
        },
      ],
    },
  },
  {
    id: 'motorFan',
    type: 'motor',
    position: { x: 800, y: 580 },
    data: {
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'motorTarget1',
          style: {
            top: 30,
            bottom: 0,
            left: -2,
            right: 0,
          },
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'motorSource1',
          style: {
            top: 10,
            bottom: 0,
            left: 80,
            right: 0,
          },
        },
      ],
      state: 'On',
    },
  },
  {
    id: 'boxLinearGauges',
    type: 'box',
    position: { x: 400, y: 520 },
    data: {},
  },
  {
    id: 'label1',
    type: 'label',
    position: { x: 790, y: 830 },
    data: {
      text: 'Cooling Sys',
      width: 120,
      height: 45,
      backgroundColor: '#C6C6C6',
      triangleDirection: 'left',
      handle: {
        type: 'target',
        position: Position.Left,
      },
    },
  },
  {
    id: 'label2',
    type: 'label',
    position: { x: 950, y: 22 },
    data: {
      text: 'Vent Sys',
      width: 120,
      height: 45,
      backgroundColor: '#C6C6C6',
      triangleDirection: 'right',
      handle: {
        type: 'target',
        position: Position.Left,
      },
    },
  },
  {
    id: 'label3',
    type: 'label',
    position: { x: 1100, y: 568 },
    data: {
      text: 'Product',
      width: 120,
      height: 45,
      backgroundColor: '#C6C6C6',
      triangleDirection: 'right',
      handle: {
        type: 'target',
        position: Position.Left,
      },
    },
  },
];
