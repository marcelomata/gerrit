/**
 * @license
 * Copyright (C) 2018 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import '../../../styles/shared-styles.js';
import '../../shared/gr-button/gr-button.js';
import '../../shared/gr-icons/gr-icons.js';
import '../../shared/gr-label/gr-label.js';
import '../../shared/gr-label-info/gr-label-info.js';
import '../../shared/gr-limited-text/gr-limited-text.js';
import {GestureEventListeners} from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import {LegacyElementMixin} from '@polymer/polymer/lib/legacy/legacy-element-mixin.js';
import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {htmlTemplate} from './gr-change-requirements_html.js';

/**
 * @extends PolymerElement
 */
class GrChangeRequirements extends GestureEventListeners(
    LegacyElementMixin(PolymerElement)) {
  static get template() { return htmlTemplate; }

  static get is() { return 'gr-change-requirements'; }

  static get properties() {
    return {
    /** @type {?} */
      change: Object,
      account: Object,
      mutable: Boolean,
      _requirements: {
        type: Array,
        computed: '_computeRequirements(change)',
      },
      _requiredLabels: {
        type: Array,
        value: () => [],
      },
      _optionalLabels: {
        type: Array,
        value: () => [],
      },
      _showWip: {
        type: Boolean,
        computed: '_computeShowWip(change)',
      },
      _showOptionalLabels: {
        type: Boolean,
        value: true,
      },
    };
  }

  static get observers() {
    return [
      '_computeLabels(change.labels.*)',
    ];
  }

  _computeShowWip(change) {
    return change.work_in_progress;
  }

  _computeRequirements(change) {
    const _requirements = [];

    if (change.requirements) {
      for (const requirement of change.requirements) {
        requirement.satisfied = requirement.status === 'OK';
        requirement.style =
            this._computeRequirementClass(requirement.satisfied);
        _requirements.push(requirement);
      }
    }
    if (change.work_in_progress) {
      _requirements.push({
        type: 'wip',
        fallback_text: 'Work-in-progress',
        tooltip: 'Change must not be in \'Work in Progress\' state.',
      });
    }

    return _requirements;
  }

  _computeRequirementClass(requirementStatus) {
    return requirementStatus ? 'approved' : '';
  }

  _computeRequirementIcon(requirementStatus) {
    return requirementStatus ? 'gr-icons:check' : 'gr-icons:schedule';
  }

  _computeLabels(labelsRecord) {
    const labels = labelsRecord.base;
    this._optionalLabels = [];
    this._requiredLabels = [];

    for (const label in labels) {
      if (!labels.hasOwnProperty(label)) { continue; }

      const labelInfo = labels[label];
      const icon = this._computeLabelIcon(labelInfo);
      const style = this._computeLabelClass(labelInfo);
      const path = labelInfo.optional ? '_optionalLabels' : '_requiredLabels';

      this.push(path, {label, icon, style, labelInfo});
    }
  }

  /**
   * @param {Object} labelInfo
   * @return {string} The icon name, or undefined if no icon should
   *     be used.
   */
  _computeLabelIcon(labelInfo) {
    if (labelInfo.approved) { return 'gr-icons:check'; }
    if (labelInfo.rejected) { return 'gr-icons:close'; }
    return 'gr-icons:schedule';
  }

  /**
   * @param {Object} labelInfo
   */
  _computeLabelClass(labelInfo) {
    if (labelInfo.approved) { return 'approved'; }
    if (labelInfo.rejected) { return 'rejected'; }
    return '';
  }

  _computeShowOptional(optionalFieldsRecord) {
    return optionalFieldsRecord.base.length ? '' : 'hidden';
  }

  _computeLabelValue(value) {
    return (value > 0 ? '+' : '') + value;
  }

  _computeShowHideIcon(showOptionalLabels) {
    return showOptionalLabels ?
      'gr-icons:expand-less' :
      'gr-icons:expand-more';
  }

  _computeSectionClass(show) {
    return show ? '' : 'hidden';
  }

  _handleShowHide(e) {
    this._showOptionalLabels = !this._showOptionalLabels;
  }

  _computeSubmitRequirementEndpoint(item) {
    return `submit-requirement-item-${item.type}`;
  }
}

customElements.define(GrChangeRequirements.is, GrChangeRequirements);
