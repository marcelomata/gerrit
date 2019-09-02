// Copyright (C) 2017 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.gerrit.extensions.api.projects;

import com.google.gerrit.extensions.api.changes.ChangeApi;
import com.google.gerrit.extensions.api.changes.CherryPickInput;
import com.google.gerrit.extensions.api.changes.IncludedInInfo;
import com.google.gerrit.extensions.common.CommitInfo;
import com.google.gerrit.extensions.restapi.NotImplementedException;
import com.google.gerrit.extensions.restapi.RestApiException;

public interface CommitApi {
  CommitInfo get() throws RestApiException;

  ChangeApi cherryPick(CherryPickInput input) throws RestApiException;

  IncludedInInfo includedIn() throws RestApiException;

  /** A default implementation for source compatibility when adding new methods to the interface. */
  class NotImplemented implements CommitApi {
    @Override
    public CommitInfo get() throws RestApiException {
      throw new NotImplementedException();
    }

    @Override
    public ChangeApi cherryPick(CherryPickInput input) throws RestApiException {
      throw new NotImplementedException();
    }

    @Override
    public IncludedInInfo includedIn() throws RestApiException {
      throw new NotImplementedException();
    }
  }
}
